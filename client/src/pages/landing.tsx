import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, Share2, Shield, Sparkles, Handshake, Repeat } from "lucide-react";
import { useAuth } from "@/lib/auth";
import logoPath from "@assets/BarterConnect_Logo_1771569174270.png";
import iconPath from "@assets/BarterConnect_Icon_1771569174270.png";

export default function LandingPage() {
  const { user } = useAuth();

  const features = [
    {
      icon: Repeat,
      title: "Skill Exchange",
      desc: "Trade what you know for what you want to learn. No money involved.",
    },
    {
      icon: Users,
      title: "Smart Matching",
      desc: "Our algorithm finds people who need your skills and offer what you need.",
    },
    {
      icon: Handshake,
      title: "Interest Handshake",
      desc: "Express interest, get accepted, and exchange contact info securely.",
    },
    {
      icon: Share2,
      title: "Shareable Links",
      desc: "Share your barter requests with anyone via a unique public link.",
    },
  ];

  const steps = [
    { num: "1", title: "Post Your Skills", desc: "Share what you can offer and what you need" },
    { num: "2", title: "Get Matched", desc: "We find people who are a perfect two-way match" },
    { num: "3", title: "Connect & Barter", desc: "Accept interests and start exchanging skills" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="shrink-0 header-logo-wrap">
            <img src={logoPath} alt="BarterConnect" data-testid="header-logo" />
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <Link href="/app">
                <Button data-testid="button-go-dashboard">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" data-testid="button-login">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button data-testid="button-signup">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="flex justify-center mb-8">
            <img src={logoPath} alt="BarterConnect" className="w-80 md:w-[28rem] lg:w-[34rem]" data-testid="hero-logo" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Skill-based bartering platform</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Trade Skills,{" "}
            <span className="text-accent">Not Money</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Connect with people who need what you know and know what you need.
            BarterConnect makes skill exchange simple and direct.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={user ? "/app" : "/signup"}>
              <Button size="lg" className="w-full sm:w-auto gap-2" data-testid="button-get-started">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href={user ? "/matches" : "/login"}>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" data-testid="button-browse-matches">
                Browse Matches
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">How It Works</h2>
          <p className="text-muted-foreground">Three simple steps to start bartering</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent text-accent-foreground text-lg font-bold mb-4">
                {step.num}
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card border-y">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Why BarterConnect?</h2>
            <p className="text-muted-foreground">Everything you need for skill exchange</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-accent/15 text-accent shrink-0">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="flex items-center justify-center gap-2 text-accent mb-4">
          <Shield className="w-5 h-5" />
          <span className="text-sm font-medium">Safe & Secure</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Start Bartering?</h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Join our community and start exchanging skills today. It's free and always will be.
        </p>
        <Link href={user ? "/app" : "/signup"}>
          <Button size="lg" className="gap-2" data-testid="button-join-now">
            Join Now
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>

      <footer className="border-t py-6">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <Link href="/" className="flex items-center gap-0 shrink-0">
            <img src={logoPath} alt="BarterConnect" className="w-40" data-testid="footer-logo" />
          </Link>
          <p>Trade skills, not money.</p>
        </div>
      </footer>
    </div>
  );
}
