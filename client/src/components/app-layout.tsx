import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard,
  PlusCircle,
  Repeat,
  List,
  Heart,
  LogOut,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/requests/new", label: "Create", icon: PlusCircle },
  { href: "/requests", label: "My Requests", icon: List },
  { href: "/matches", label: "Matches", icon: Zap },
  { href: "/interests", label: "Interests", icon: Heart },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-2">
            <Link href="/app" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground">
                <Repeat className="w-4 h-4" />
              </div>
              <span className="font-semibold text-lg hidden sm:inline">BarterConnect</span>
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
                    className="gap-1.5"
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.name}</span>
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
                    className="w-full justify-start gap-2"
                    data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
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
    </div>
  );
}
