import { config } from "./config";

export const authCopy = {
  companyName: config.company.name,
  login: {
    title: `Welcome to ${config.company.name}`,
    subtitle: "A modern Next.js starter with Supabase and shadcn/ui",
    emailLabel: "Email",
    emailPlaceholder: "Type your email",
    submitButton: "Send verification code",
    signUpLink: "Don't have an account? Sign up",
  },
  signUp: {
    title: "Create your account",
    subtitle: `Get started with ${config.company.name}`,
    emailLabel: "Email",
    emailPlaceholder: "Type your email",
    submitButton: "Send verification code",
    signInLink: "Already have an account? Sign in",
  },
  verifyOtp: {
    title: "Enter verification code",
    subtitle: "We've sent a 6-digit code to your email",
    otpLabel: "Verification code",
    otpPlaceholder: "Enter 6-digit code",
    submitButton: "Verify",
    resendLink: "Didn't receive the code? Resend",
    backLink: "Back to login",
  },
  legal: {
    termsText: 'By clicking "Send verification code" you agree to our',
    termsLink: "Terms of Use",
    privacyLink: "Privacy Policy",
    andText: "and",
  },
} as const;
