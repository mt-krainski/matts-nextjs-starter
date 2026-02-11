"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar, Navbar } from "@/components";
import type { Workspace } from "@/components/Navbar/component";
import { SidebarInset } from "@/components/ui/sidebar";
import { Loader2, ListTodo, Users } from "lucide-react";

interface Team {
  id: string;
  name: string;
  isPrivate: boolean;
}

interface DashboardShellProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  workspaces: Workspace[];
  selectedWorkspaceId?: string;
  teams: Team[];
  children: ReactNode;
}

export default function DashboardShell({
  user,
  workspaces,
  selectedWorkspaceId,
  teams,
  children,
}: DashboardShellProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleLogoutClick = async () => {
    setIsSigningOut(true);
    try {
      await fetch("/auth/signout", { method: "POST" });
    } finally {
      router.push("/auth");
      router.refresh();
    }
  };

  const handleAccountClick = () => router.push("/account");

  const privateTeams = teams.filter((t) => t.isPrivate);
  const sharedTeams = teams.filter((t) => !t.isPrivate);

  const privateSidebarItems = privateTeams.map((team) => ({
    id: team.id,
    label: team.name,
    icon: ListTodo,
    onClick: () => router.push(`/teams/${team.id}`),
  }));

  const teamSidebarItems = sharedTeams.map((team) => ({
    id: team.id,
    label: team.name,
    icon: Users,
    onClick: () => router.push(`/teams/${team.id}`),
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <AppSidebar
        privateItems={privateSidebarItems}
        teamItems={teamSidebarItems}
        onHomeClick={() => router.push("/")}
      >
        <SidebarInset className="flex flex-1 flex-col">
          <Navbar
            workspaces={workspaces}
            selectedWorkspaceId={selectedWorkspaceId}
            user={{ name: user.name, email: user.email, avatar: user.avatar }}
            onWorkspaceChange={(workspaceId) =>
              router.push(`/?workspace=${workspaceId}`)
            }
            onAccountClick={handleAccountClick}
            onLogoutClick={handleLogoutClick}
          />
          <div className="flex-1 bg-muted/30 p-6">{children}</div>
        </SidebarInset>
      </AppSidebar>

      {isSigningOut && (
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center gap-2 bg-background/80 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Signing out&hellip;
        </div>
      )}
    </div>
  );
}
