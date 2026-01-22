import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AuthProvider } from "@/components/auth-provider";
import { AuthGuard } from "@/components/auth-guard";
import DashboardShell from "./dashboard-shell";
import { createClient } from "@/lib/supabase/server";
import { getProfileSummary, getUserWorkspaces } from "@/lib/services";

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

  const profile = await getProfileSummary(user.id);
  const userWorkspaces = await getUserWorkspaces(user.id);

  const workspaceList = userWorkspaces.map((membership) => ({
    id: membership.workspace.id,
    name: membership.workspace.name,
  }));

  return (
    <AuthProvider>
      <AuthGuard>
        <DashboardShell
          user={{
            id: user.id,
            name: profile?.fullName ?? user.email ?? "",
            email: user.email ?? "",
            avatar: profile?.avatarUrl ?? undefined,
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
