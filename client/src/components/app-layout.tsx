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
import logoPath from "@assets/BarterConnect_Logo_new.svg";

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
    <div className="min-h-screen bg-[#faf6f0] flex flex-col">
      <header className="sticky top-0 z-50 bg-[#3d4a3c]/95 backdrop-blur-xl shadow-lg border-b border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-2">
            <Link href="/app">
              <img src={logoPath} alt="BarterConnect" className="h-9 w-auto object-contain" data-testid="app-header-logo" />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-1.5 relative rounded-full transition-all duration-200 ${active ? "bg-[#D99B42] text-white font-semibold shadow-md" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    {item.showBadge && hasUnread && (
                      <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-[#B95755] border-2 border-[#3d4a3c] animate-pulse" />
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/account")}
              className="relative group cursor-pointer"
              data-testid="button-avatar"
            >
              <UserAvatar
                name={user?.name || "?"}
                avatarUrl={user?.avatarUrl}
                className="h-8 w-8 ring-2 ring-[#D99B42]/50 group-hover:ring-[#D99B42] transition-all duration-200"
              />
            </button>
            <Link href="/account">
              <span className="text-sm text-white/70 hidden sm:inline hover:text-white transition-colors cursor-pointer">{user?.name}</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { logout(); }}
              data-testid="button-logout"
              className="hidden md:flex text-white/50 hover:text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#3d4a3c] px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const active = location === item.href;
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-2 relative rounded-xl transition-all duration-200 ${active ? "bg-[#D99B42] text-white font-semibold" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
                    data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    {item.showBadge && hasUnread && (
                      <span className="absolute top-2 right-4 h-2.5 w-2.5 rounded-full bg-[#B95755] animate-pulse" />
                    )}
                  </Button>
                </Link>
              );
            })}
            <Link href="/account" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-2 rounded-xl transition-all duration-200 ${location === "/account" ? "bg-[#D99B42] text-white font-semibold" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
                data-testid="mobile-nav-account"
              >
                <Settings className="w-4 h-4" />
                Account
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 rounded-xl text-[#B95755] hover:bg-[#B95755]/10"
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

      <footer className="bg-[#3d4a3c] py-4 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-white/40">
          <img src={logoPath} alt="BarterConnect" className="w-28 opacity-50" data-testid="app-footer-logo" />
          <span>Trade skills, not money.</span>
        </div>
      </footer>
    </div>
  );
}
