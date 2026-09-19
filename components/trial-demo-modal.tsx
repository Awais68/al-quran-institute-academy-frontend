"use client";

import { useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GraduationCap, Sparkles } from "lucide-react";

const SESSION_KEY = "aqi-trial-demo-modal-shown";
const SHOW_DELAY_MS = 1500;
const HIDDEN_PATHS = ["/signup", "/signup/account"];

export default function TrialDemoModal() {
  const [open, setOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return;

    const timer = setTimeout(() => {
      // Only logged-out visitors get the offer.
      if (user) return;
      setOpen(true);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, [user, pathname]);

  const goToDemoPage = () => {
    setOpen(false);
    router.push("/signup");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md overflow-hidden p-0 border-0">
        {/* top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary-500 via-sky-400 to-primary-600" />

        <div className="px-6 pb-6 pt-2 sm:px-8 sm:pb-7">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 ring-1 ring-primary-100">
            <GraduationCap className="h-7 w-7 text-primary-600" aria-hidden="true" />
          </div>

          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold text-primary-800">
              Book Your Free Trial Class Today
            </DialogTitle>
            <DialogDescription className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-600">
              Start your Quran learning journey with a free one-to-one demo
              class. Meet a qualified teacher, pick the course that fits you,
              and see the difference for yourself — no payment required to
              start.
            </DialogDescription>
          </DialogHeader>

          <Button
            onClick={goToDemoPage}
            className="mt-6 h-12 w-full bg-primary-600 text-base font-medium text-white shadow-md shadow-primary-600/20 hover:bg-primary-700"
          >
            <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
            Request a Free Demo Class
          </Button>

          <p className="mt-4 text-center text-xs text-gray-500">
            We&apos;ll contact you within 24 hours to arrange your free trial
            class.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}