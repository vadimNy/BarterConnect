import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { UserAvatar } from "@/components/user-avatar";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  PlusCircle,
  List,
  Heart,
  LogOut,
  Menu,
  X,
  Zap,
  MessageCircle,
  Settings,
} from "lucide-react";
import { useState } from "react";
import logoPath from "@assets/BarterConnect_Logo_cropped.png";

const navItems = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/requests/new", label: "Create", icon: PlusCircle },
  { href: "/requests", label: "My Barters", icon: List },
  { href: "/matches", label: "Matches", icon: Zap },
  { href: "/interests", label: "Interests", icon: Heart },
  { href: "/messages", label: "Messages", icon: MessageCircle, showBadge: true },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: conversations } = useQuery<any[]>({
    queryKey: ["/api/conversations"],
    enabled: !!user,
    refetchInterval: 10000,
  });

  const hasUnread = conversations?.some(c => c.unreadCount > 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-2">
            <Link href="/app">
              <img src={logoPath} alt="BarterConnect" className="h-12 w-auto object-contain" data-testid="app-header-logo" />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={active ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-1.5 relative"
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    {item.showBadge && hasUnread && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-accent animate-pulse" />
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/account")}
              className="relative group cursor-pointer"
              data-testid="button-avatar"
            >
              <UserAvatar
                name={user?.name || "?"}
                avatarUrl={user?.avatarUrl}
                className="h-8 w-8"
              />
            </button>
            <Link href="/account">
              <span className="text-sm text-muted-foreground hidden sm:inline hover:text-foreground transition-colors cursor-pointer">{user?.name}</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { logout(); }}
              data-testid="button-logout"
              className="hidden md:flex"
            >
              <LogOut className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const active = location === item.href;
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant={active ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2 relative"
                    data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    {item.showBadge && hasUnread && (
                      <span className="absolute top-2 right-4 h-2 w-2 rounded-full bg-accent animate-pulse" />
                    )}
                  </Button>
                </Link>
              );
            })}
            <Link href="/account" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant={location === "/account" ? "secondary" : "ghost"}
                className="w-full justify-start gap-2"
                data-testid="mobile-nav-account"
              >
                <Settings className="w-4 h-4" />
                Account
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-destructive"
              onClick={() => { setMobileMenuOpen(false); logout(); }}
              data-testid="mobile-button-logout"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </Button>
          </div>
        )}
      </header>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      <footer className="border-t py-4 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <img src={logoPath} alt="BarterConnect" className="w-36" data-testid="app-footer-logo" />
          <span>Trade skills, not money.</span>
        </div>
      </footer>
    </div>
  );
}
