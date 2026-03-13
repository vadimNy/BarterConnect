import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <Link href="/">
            <h1 className="text-xl font-bold">BarterConnect</h1>
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <Link href="/app">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">Trade Skills, Not Cash.</h1>
        <p className="text-2xl font-bold text-primary mb-6">It's all about networking.</p>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          A community where people trade skills instead of dollars. You help someone with what you're great at, and they help you with what they're great at.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href={user ? "/app" : "/signup"}>
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </section>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>Trade skills, not cash.</p>
      </footer>
    </div>
  );
}
