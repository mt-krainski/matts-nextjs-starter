"use client";

import { sendOtp } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components";
import { authCopy } from "@/lib/copy";
import { config } from "@/lib/config";
import Link from "next/link";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-gray-900 hover:bg-gray-800"
    >
      {pending ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          {authCopy.auth.submitButton}
        </>
      ) : (
        authCopy.auth.submitButton
      )}
    </Button>
  );
}

export default function AuthPage() {
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
              {authCopy.auth.title}
            </h1>
            <p className="text-gray-600">{authCopy.auth.subtitle}</p>
          </div>

          {/* Form */}
          <form className="space-y-4" action={sendOtp}>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-900"
              >
                {authCopy.auth.emailLabel}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={authCopy.auth.emailPlaceholder}
                required
                className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              />
            </div>
            <SubmitButton />
          </form>

          {/* Legal Disclosure */}
          <div className="text-center text-xs text-gray-500">
            <p>
              {authCopy.legal.termsText}{" "}
              <Link href={config.urls.terms} className="underline">
                {authCopy.legal.termsLink}
              </Link>{" "}
              {authCopy.legal.andText}{" "}
              <Link href={config.urls.privacy} className="underline">
                {authCopy.legal.privacyLink}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
