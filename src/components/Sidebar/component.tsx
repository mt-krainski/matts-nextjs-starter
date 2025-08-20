"use client";

import { useState } from "react";
import { Search, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}

export interface AppSidebarProps {
  privateItems?: SidebarItem[];
  teamItems?: SidebarItem[];
  onSearch?: (query: string) => void;
  onHomeClick?: () => void;
  searchResults?: SearchResult[];
  className?: string;
}

export function AppSidebar({
  privateItems = [],
  teamItems = [],
  onSearch,
  onHomeClick,
  searchResults = [],
  className,
}: AppSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleModalSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <SidebarProvider>
      <Sidebar className={cn("w-64", className)}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setIsSearchModalOpen(true)}>
                    <Search className="h-4 w-4" />
                    <span>Search...</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={onHomeClick}>
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Private Section */}
          {privateItems.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>Private</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {privateItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        asChild={!!item.href}
                        onClick={item.onClick}
                        isActive={item.isActive}
                      >
                        {item.href ? (
                          <a href={item.href}>
                            {item.icon && <item.icon className="h-4 w-4" />}
                            <span>{item.label}</span>
                          </a>
                        ) : (
                          <>
                            {item.icon && <item.icon className="h-4 w-4" />}
                            <span>{item.label}</span>
                          </>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* Team Section */}
          {teamItems.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>Team</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {teamItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        asChild={!!item.href}
                        onClick={item.onClick}
                        isActive={item.isActive}
                      >
                        {item.href ? (
                          <a href={item.href}>
                            {item.icon && <item.icon className="h-4 w-4" />}
                            <span>{item.label}</span>
                          </a>
                        ) : (
                          <>
                            {item.icon && <item.icon className="h-4 w-4" />}
                            <span>{item.label}</span>
                          </>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        {/* Search Modal */}
        <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="sr-only">Search</DialogTitle>
            </DialogHeader>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Type a command or search..."
                value={searchQuery}
                onChange={(e) => handleModalSearch(e.target.value)}
                className="w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />
            </div>

            {/* Search Results */}
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((result) => (
                    <Button
                      key={result.id}
                      variant="ghost"
                      className="w-full justify-start gap-3 h-auto p-3 text-left"
                      onClick={() => {
                        result.onClick?.();
                        setIsSearchModalOpen(false);
                      }}
                    >
                      {result.icon && (
                        <result.icon className="h-4 w-4 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {result.title}
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {result.content}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="text-sm text-muted-foreground px-2 py-1">
                  No results found for &quot;{searchQuery}&quot;
                </div>
              ) : (
                <div className="text-sm text-muted-foreground px-2 py-1">
                  Start typing to search...
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </Sidebar>
    </SidebarProvider>
  );
}
