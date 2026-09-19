"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { programTitles } from "@/lib/programs";
import { getErrorMessage } from "@/lib/error-handler";

type FieldErrors = Partial<Record<"fullName" | "email" | "phone" | "course", string>>;
type Status = { kind: "idle" | "success" | "error"; message?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_RE = /^[\p{L}\s.'-]+$/u;
const PHONE_RE = /^\+?[0-9][0-9\s()-]{5,}$/;

/** Mirrors the zod schema in app/api/signup/route.ts so errors show before a round-trip. */
function validate(values: {
  fullName: string;
  email: string;
  phone: string;
  course: string;
}): FieldErrors {
  const errors: FieldErrors = {};

  const name = values.fullName.trim();
  if (!name) errors.fullName = "Full name is required";
  else if (name.length < 3) errors.fullName = "Full name must be at least 3 characters";
  else if (!NAME_RE.test(name))
    errors.fullName = "Full name may only contain letters, spaces, . ' and -";

  const email = values.email.trim();
  if (!email) errors.email = "Email is required";
  else if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address";

  const phone = values.phone.trim();
  if (!phone) errors.phone = "Phone number is required";
  else if (!PHONE_RE.test(phone)) errors.phone = "Please enter a valid phone number";

  if (!values.course) errors.course = "Please select a course";
  else if (!programTitles.includes(values.course))
    errors.course = "Please choose one of the listed courses";

  return errors;
}

const EMPTY = { fullName: "", email: "", phone: "", course: "" };

export default function EnrollForm() {
  const uid = useId();
  const [values, setValues] = useState(EMPTY);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const setField = (field: keyof typeof EMPTY) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear the inline error as soon as the user starts correcting it.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ kind: "idle" });

    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        if (result.errors) setErrors(result.errors as FieldErrors);
        setStatus({
          kind: "error",
          message: result.message || "Something went wrong. Please try again.",
        });
        return;
      }

      setValues(EMPTY);
      setErrors({});
      setStatus({ kind: "success", message: result.message });
    } catch (error) {
      setStatus({
        kind: "error",
        message: getErrorMessage(error, {
          endpoint: "/api/signup",
          fallback:
            "We couldn't reach the server. Check your connection and try again.",
        }),
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (status.kind === "success") {
    return (
      <div
        role="status"
        className="rounded-lg border border-green-200 bg-green-50 p-6 text-center"
      >
        <CheckCircle2 className="mx-auto h-10 w-10 text-green-600" aria-hidden="true" />
        <h2 className="mt-3 text-lg font-semibold text-green-900">
          Request received
        </h2>
        <p className="mt-1 text-sm text-green-800">{status.message}</p>
        <Button
          type="button"
          variant="outline"
          className="mt-5"
          onClick={() => setStatus({ kind: "idle" })}
        >
          Submit another enquiry
        </Button>
      </div>
    );
  }

  const fieldClass = (field: keyof FieldErrors) =>
    cn("h-11", errors[field] && "border-red-500 focus-visible:ring-red-500");

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {status.kind === "error" && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{status.message}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor={`${uid}-fullName`}>
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id={`${uid}-fullName`}
          name="fullName"
          autoComplete="name"
          placeholder="e.g. Muhammad Bilal"
          value={values.fullName}
          onChange={(e) => setField("fullName")(e.target.value)}
          aria-invalid={Boolean(errors.fullName)}
          aria-describedby={errors.fullName ? `${uid}-fullName-error` : undefined}
          className={fieldClass("fullName")}
        />
        {errors.fullName && (
          <p id={`${uid}-fullName-error`} className="text-xs text-red-600">
            {errors.fullName}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${uid}-email`}>
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id={`${uid}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={(e) => setField("email")(e.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${uid}-email-error` : undefined}
          className={fieldClass("email")}
        />
        {errors.email && (
          <p id={`${uid}-email-error`} className="text-xs text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${uid}-phone`}>
          Phone Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id={`${uid}-phone`}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+92 300 1234567"
          value={values.phone}
          onChange={(e) => setField("phone")(e.target.value)}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? `${uid}-phone-error` : undefined}
          className={fieldClass("phone")}
        />
        {errors.phone && (
          <p id={`${uid}-phone-error`} className="text-xs text-red-600">
            {errors.phone}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${uid}-course`}>
          Course <span className="text-red-500">*</span>
        </Label>
        {/* Native <select> on purpose: it renders in the server HTML, unlike the
            Radix Select used elsewhere, so this form works without JavaScript too. */}
        <select
          id={`${uid}-course`}
          name="course"
          value={values.course}
          onChange={(e) => setField("course")(e.target.value)}
          aria-invalid={Boolean(errors.course)}
          aria-describedby={errors.course ? `${uid}-course-error` : undefined}
          className={cn(
            "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            errors.course && "border-red-500 focus-visible:ring-red-500"
          )}
        >
          <option value="">Select a course…</option>
          {programTitles.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
        {errors.course && (
          <p id={`${uid}-course-error`} className="text-xs text-red-600">
            {errors.course}
          </p>
        )}
      </div>

      {/* Honeypot — visually hidden, never announced, never tabbable. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input
          id={`${uid}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="h-12 w-full bg-blue-600 text-base font-medium text-white hover:bg-blue-700"
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Submitting…
          </>
        ) : (
          "Submit"
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        We&apos;ll contact you within 24 hours to arrange your free trial class.
      </p>
    </form>
  );
}
