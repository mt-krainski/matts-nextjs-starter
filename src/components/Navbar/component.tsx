import Image from "next/image";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Building2,
  User as UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components";

export interface Workspace {
  id: string;
  name: string;
  type: "personal" | "team";
}

export interface NavbarProps {
  workspaces?: Workspace[];
  selectedWorkspaceId?: string;
  onWorkspaceChange?: (workspaceId: string) => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onAccountClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  className?: string;
}

export function Navbar({
  workspaces = [],
  selectedWorkspaceId,
  onWorkspaceChange,
  user,
  onAccountClick,
  onSettingsClick,
  onLogoutClick,
  className,
}: NavbarProps) {
  const selectedWorkspace =
    workspaces.find((w) => w.id === selectedWorkspaceId) || workspaces[0];

  return (
    <div
      className={cn(
        "flex h-16 items-center justify-between border-b bg-background px-4",
        className
      )}
    >
      {/* Left: Logo and Workspace Selector */}
      <div className="flex items-center gap-4">
        <Logo />

        {/* Workspace Selector */}
        {workspaces.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                {selectedWorkspace?.type === "team" ? (
                  <Building2 className="h-4 w-4" />
                ) : (
                  <UserIcon className="h-4 w-4" />
                )}
                <span className="truncate">{selectedWorkspace?.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[200px]">
              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => onWorkspaceChange?.(workspace.id)}
                >
                  {workspace.type === "team" ? (
                    <Building2 className="h-4 w-4" />
                  ) : (
                    <UserIcon className="h-4 w-4" />
                  )}
                  <span className="truncate">{workspace.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Right: Theme Toggle and User Menu */}
      <div className="flex items-center gap-2">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
                <span className="hidden sm:inline-block">{user.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[200px]">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onAccountClick}>
                <User className="h-4 w-4" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSettingsClick}>
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={onLogoutClick}>
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
