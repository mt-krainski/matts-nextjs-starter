import { sendOtp } from "../login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { authCopy } from "@/lib/copy";
import Link from "next/link";

export default function SignUpPage() {
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
              {authCopy.signUp.title}
            </h1>
            <p className="text-gray-600">{authCopy.signUp.subtitle}</p>
          </div>

          {/* Form */}
          <form className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-900"
              >
                {authCopy.signUp.emailLabel}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={authCopy.signUp.emailPlaceholder}
                required
                className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              />
            </div>
            <Button
              type="submit"
              formAction={sendOtp}
              className="w-full bg-gray-900 hover:bg-gray-800"
            >
              {authCopy.signUp.submitButton}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {authCopy.signUp.signInLink}
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
