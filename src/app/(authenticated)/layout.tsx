import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AuthProvider } from "@/components/auth-provider";
import { AuthGuard } from "@/components/auth-guard";
import DashboardShell from "./dashboard-shell";
import { createClient } from "@/lib/supabase/server";

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export default async function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    redirect("/auth");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single();

  const { data: workspaces } = await supabase
    .from("user_workspaces")
    .select("workspace_id, workspaces(name)")
    .is("deleted_at", null);

  console.log("workspaces", workspaces);

  const workspaceList = (workspaces ?? []).map((membership) => ({
    id: membership.workspace_id,
    name: membership.workspaces?.name ?? "Untitled workspace",
  }));

  return (
    <AuthProvider>
      <AuthGuard>
        <DashboardShell
          user={{
            id: user.id,
            name: profile?.full_name ?? user.email ?? "",
            email: user.email ?? "",
            avatar: profile?.avatar_url ?? undefined,
          }}
          workspaces={workspaceList}
          selectedWorkspaceId={workspaceList[0]?.id}
        >
          {children}
        </DashboardShell>
      </AuthGuard>
    </AuthProvider>
  );
}
