"use client";

import AccountForm from "./account-form";
import { useAuth } from "@/components/auth-provider";

export default function Account() {
  const { user } = useAuth();
  return <AccountForm user={user} />;
}
