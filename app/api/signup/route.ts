import { NextResponse } from "next/server";
import { z } from "zod";
import { BASE_URL } from "@/app/constant/constant";
import { programTitles } from "@/lib/programs";
import { clientIp, rateLimit } from "@/lib/rate-limit";

// Leads are written to an external service, so this route must run on Node
// and must never be cached or statically evaluated.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const signupSchema = z.object({
  fullName: z
    .string({ required_error: "Full name is required" })
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(80, "Full name is too long")
    .regex(/^[\p{L}\s.'-]+$/u, "Full name may only contain letters, spaces, . ' and -"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address")
    .max(120, "Email is too long"),
  phone: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .min(7, "Phone number is too short")
    .max(20, "Phone number is too long")
    .regex(/^\+?[0-9][0-9\s()-]{5,}$/, "Please enter a valid phone number"),
  course: z.enum(programTitles as [string, ...string[]], {
    errorMap: () => ({ message: "Please choose one of the listed courses" }),
  }),
  // Honeypot: real users never fill this, bots usually do. Deliberately
  // permissive — rejecting it here would return a validation error that tells
  // the bot the field is a trap. It is handled silently after parsing instead.
  website: z.string().optional(),
});

type Lead = z.infer<typeof signupSchema>;

type UpstreamResult =
  | { kind: "stored" }
  | { kind: "duplicate" }
  | { kind: "failed"; reason: string };

/**
 * Best-effort write to the existing backend's contact-form collection.
 *
 * The backend validates fast (duplicate-email 409 comes back in <1s) but its
 * insert path has been observed to hang for >120s on genuinely new records.
 * We therefore cap it aggressively and treat a hang as "failed" rather than
 * letting it block the visitor's response.
 */
async function storeInBackend(lead: Lead): Promise<UpstreamResult> {
  try {
    const response = await fetch(`${BASE_URL}/contactForms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: lead.fullName,
        email: lead.email,
        phone: lead.phone,
        subject: `Course Enquiry: ${lead.course}`,
        // The backend rejects messages shorter than 10 characters.
        message: `New enrolment enquiry from the signup page.\nCourse: ${lead.course}\nPhone: ${lead.phone}`,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });

    if (response.status === 409) return { kind: "duplicate" };
    if (response.ok) return { kind: "stored" };

    const detail = await response.text().catch(() => "");
    return { kind: "failed", reason: `${response.status} ${detail.slice(0, 200)}` };
  } catch (error) {
    const name = error instanceof Error ? error.name : "Error";
    return { kind: "failed", reason: name === "TimeoutError" ? "upstream timeout" : String(error) };
  }
}

/** Email notification via Resend. Returns false when unconfigured or failing. */
async function emailLead(lead: Lead): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!apiKey || !to) return false;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL || "Al-Quran Institute <onboarding@resend.dev>",
        to: to.split(",").map((address) => address.trim()),
        reply_to: lead.email,
        subject: `New enrolment enquiry — ${lead.course}`,
        text: [
          `Course:  ${lead.course}`,
          `Name:    ${lead.fullName}`,
          `Email:   ${lead.email}`,
          `Phone:   ${lead.phone}`,
          "",
          `Received: ${new Date().toISOString()}`,
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(12_000),
    });

    if (!response.ok) {
      console.error("[signup] resend rejected", response.status, await response.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (error) {
    console.error("[signup] resend failed", error);
    return false;
  }
}

// Each submission can fan out to the backend and to Resend, so an unthrottled
// endpoint is both a spam hose and a billable one.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  const limit = rateLimit(`signup:${clientIp(request)}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Too many enquiries from this connection. Please wait a few minutes, or WhatsApp us directly.",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    // Flatten to { field: "first error" } so the form can render inline errors.
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!errors[key]) errors[key] = issue.message;
    }
    return NextResponse.json(
      { ok: false, message: "Please correct the highlighted fields.", errors },
      { status: 400 }
    );
  }

  const lead = parsed.data;

  // Honeypot tripped — respond as if it worked so bots learn nothing.
  if (lead.website) {
    return NextResponse.json({ ok: true, message: "Thank you! We'll be in touch shortly." });
  }

  // Both channels run; the lead is only lost if BOTH fail.
  const [upstream, emailed] = await Promise.all([storeInBackend(lead), emailLead(lead)]);

  if (upstream.kind === "duplicate") {
    return NextResponse.json(
      {
        ok: false,
        errors: { email: "We already have an enquiry from this email address." },
        message:
          "You've already sent us an enquiry with this email. Our team will be in touch — or WhatsApp us if it's urgent.",
      },
      { status: 409 }
    );
  }

  if (upstream.kind === "failed") {
    console.error("[signup] backend write failed:", upstream.reason);
  }

  if (upstream.kind === "stored" || emailed) {
    const firstName = lead.fullName.split(" ")[0];
    return NextResponse.json({
      ok: true,
      message: `Thank you, ${firstName}! Your request for ${lead.course} has been received. Our team will contact you within 24 hours.`,
    });
  }

  return NextResponse.json(
    {
      ok: false,
      message:
        "We couldn't save your request right now. Please try again in a moment, or WhatsApp us directly.",
    },
    { status: 502 }
  );
}

export async function GET() {
  return NextResponse.json({ ok: false, message: "Method not allowed." }, { status: 405 });
}
