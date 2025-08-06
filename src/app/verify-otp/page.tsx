"use client";

import { verifyOtp, resendOtp } from "../login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { authCopy } from "@/lib/copy";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const resent = searchParams.get("resent") === "true";
  const [showMessage, setShowMessage] = useState(resent);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => setShowMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="p-6">
        <Logo />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-6">
          {/* Title and Subtitle */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {authCopy.verifyOtp.title}
            </h1>
            <p className="text-gray-600">{authCopy.verifyOtp.subtitle}</p>
            {email && (
              <p className="text-sm text-gray-500 font-medium">{email}</p>
            )}
          </div>

          {/* Success Message */}
          {showMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              Verification code resent successfully!
            </div>
          )}

          {/* Verification Form */}
          <form className="space-y-4">
            <input type="hidden" name="email" value={email} />
            <div className="space-y-2">
              <Label
                htmlFor="token"
                className="text-sm font-medium text-gray-900"
              >
                {authCopy.verifyOtp.otpLabel}
              </Label>
              <Input
                id="token"
                name="token"
                type="text"
                placeholder={authCopy.verifyOtp.otpPlaceholder}
                required
                maxLength={6}
                pattern="[0-9]{6}"
                className="border-gray-300 focus:border-gray-900 focus:ring-gray-900 text-center text-lg tracking-widest"
              />
            </div>
            <Button
              type="submit"
              formAction={verifyOtp}
              className="w-full bg-gray-900 hover:bg-gray-800"
            >
              {authCopy.verifyOtp.submitButton}
            </Button>
          </form>

          {/* Resend Code Form */}
          <form className="text-center">
            <input type="hidden" name="email" value={email} />
            <button
              type="submit"
              formAction={resendOtp}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              {authCopy.verifyOtp.resendLink}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {authCopy.verifyOtp.backLink}
            </Link>
          </div>

          {/* Legal Disclosure */}
          <div className="text-center text-xs text-gray-500">
            <p>
              {authCopy.legal.termsText}{" "}
              <Link
                href={process.env.NEXT_PUBLIC_TERMS_URL || "#"}
                className="underline"
              >
                {authCopy.legal.termsLink}
              </Link>{" "}
              {authCopy.legal.andText}{" "}
              <Link
                href={process.env.NEXT_PUBLIC_PRIVACY_URL || "#"}
                className="underline"
              >
                {authCopy.legal.privacyLink}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
