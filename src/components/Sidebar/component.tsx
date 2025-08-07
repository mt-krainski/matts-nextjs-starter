import { useState } from "react";
import { Search, Home, Folder, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export interface SidebarProps {
  privateItems?: SidebarItem[];
  teamItems?: SidebarItem[];
  onSearch?: (query: string) => void;
  onHomeClick?: () => void;
  className?: string;
}

export function Sidebar({
  privateItems = [],
  teamItems = [],
  onSearch,
  onHomeClick,
  className,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <div
      className={cn(
        "flex h-full w-64 flex-col border-r bg-background",
        className
      )}
    >
      {/* Search */}
      <div className="border-b p-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </form>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Home */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={onHomeClick}
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>

        {/* Private Section */}
        {privateItems.length > 0 && (
          <div>
            <div className="mb-2 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Private
            </div>
            <div className="space-y-1">
              {privateItems.map((item) => (
                <Button
                  key={item.id}
                  variant={item.isActive ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                  onClick={item.onClick}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Team Section */}
        {teamItems.length > 0 && (
          <div>
            <div className="mb-2 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Team
            </div>
            <div className="space-y-1">
              {teamItems.map((item) => (
                <Button
                  key={item.id}
                  variant={item.isActive ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                  onClick={item.onClick}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
