import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { UserAvatar } from "@/components/user-avatar";
import { useUpload } from "@/hooks/use-upload";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
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
  Camera,
} from "lucide-react";
import { useState, useRef } from "react";
import logoPath from "@assets/BarterConnect_Logo_cropped.png";

const navItems = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/requests/new", label: "Create", icon: PlusCircle },
  { href: "/requests", label: "My Requests", icon: List },
  { href: "/matches", label: "Matches", icon: Zap },
  { href: "/interests", label: "Interests", icon: Heart },
  { href: "/messages", label: "Messages", icon: MessageCircle },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadFile, isUploading } = useUpload({
    onSuccess: async (response) => {
      await apiRequest("POST", "/api/users/me/avatar", {
        avatarUrl: response.objectPath,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-2">
            <Link href="/app">
              <img src={logoPath} alt="BarterConnect" className="h-12" data-testid="app-header-logo" />
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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              data-testid="input-avatar-upload"
            />
            <button
              onClick={handleAvatarClick}
              className="relative group cursor-pointer"
              disabled={isUploading}
              data-testid="button-avatar"
            >
              <UserAvatar
                name={user?.name || "?"}
                avatarUrl={user?.avatarUrl}
                className="h-8 w-8"
              />
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-3.5 h-3.5 text-white" />
              </div>
            </button>
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

      <footer className="border-t py-4 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <img src={logoPath} alt="BarterConnect" className="w-36" data-testid="app-footer-logo" />
          <span>Trade skills, not money.</span>
        </div>
      </footer>
    </div>
  );
}
