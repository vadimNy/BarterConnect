import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Share2, Sparkles, Handshake, Search, MessageCircle, Star, Globe, CheckCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import logoPath from "@assets/BarterConnect_Logo_new.svg";

export default function LandingPage() {
  const { user } = useAuth();

  const features = [
    {
      icon: Globe,
      title: "Build Your Network, Your Way",
      desc: "BarterConnect isn't just about trading skills — it's about building real relationships with people whose talents complement yours. Your next go-to person is one barter away.",
    },
    {
      icon: Search,
      title: "Smart, Three-Tier Matching",
      desc: "Our matching engine doesn't just find perfect two-way matches — it also surfaces people who offer what you need or need what you offer, so you never miss an opportunity.",
    },
    {
      icon: Handshake,
      title: "Trust-First Connections",
      desc: "No awkward cold calls. Express interest, wait for mutual acceptance, and only then exchange contact info. Every connection starts with a handshake, not a sales pitch.",
    },
    {
      icon: Star,
      title: "Reputation That Follows You",
      desc: "Every completed barter builds your profile. The more you exchange, the more trusted you become — making it easier to connect with skilled professionals.",
    },
    {
      icon: MessageCircle,
      title: "Built-In Messaging",
      desc: "Once you're matched, chat directly within BarterConnect. No need to share personal emails or phone numbers until you're ready.",
    },
    {
      icon: Share2,
      title: "Shareable Barter Links",
      desc: "Got a specific skill to offer? Create a shareable link and post it on LinkedIn, Facebook, or anywhere. Let the right people come to you.",
    },
  ];

  const steps = [
    {
      num: "1",
      title: "Tell Us What You've Got — And What You Need",
      desc: "Create a barter listing by describing the skill you can offer and the skill you're looking for. Whether it's web design, legal advice, photography, plumbing, or social media marketing — if you have it, someone out there needs it.",
    },
    {
      num: "2",
      title: "Get Matched With the Right People",
      desc: "Our three-tier matching system goes to work instantly. We'll show you perfect two-way matches, people who offer what you need, and people who are looking for exactly what you bring to the table.",
    },
    {
      num: "3",
      title: "Connect, Chat & Exchange Skills",
      desc: "Found someone interesting? Send them an interest request. Once they accept, you'll be connected with built-in messaging to work out the details. Complete the exchange, build your reputation, and grow your network — one barter at a time.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-primary/20 bg-primary backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="shrink-0">
            <img src={logoPath} alt="BarterConnect" className="h-12" data-testid="header-logo" />
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <Link href="/app">
                <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" data-testid="button-go-dashboard">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10" data-testid="button-login">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" data-testid="button-signup">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="relative max-w-5xl mx-auto px-4 py-20 md:py-32 text-center">
          <div className="flex justify-center mb-12">
            <img src={logoPath} alt="BarterConnect" className="w-64 md:w-80 lg:w-96" data-testid="hero-logo" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The skill-based networking platform</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8">
            Trade Skills,{" "}
            <span className="text-accent">Not Cash.</span>
          </h1>
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary max-w-3xl mx-auto mb-8">
            It's all about networking.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            We all wish we knew a plumber, a lawyer, a web designer, a photographer, a marketing expert...
          </p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            <strong className="text-primary">BarterConnect is exactly that.</strong> A community where people trade skills instead of dollars. You help someone with what you're great at, and they help you with what they're great at. Simple as that.
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
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" data-testid="text-how-it-works">How It Works</h2>
          <p className="text-muted-foreground">Getting started is easy — and it's completely free</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent text-accent-foreground text-xl font-bold mb-4">
                {step.num}
              </div>
              <h3 className="font-semibold text-lg mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card border-y">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3" data-testid="text-why-barterconnect">Why Choose BarterConnect?</h2>
            <p className="text-muted-foreground">More than just a marketplace — it's the network you always wished you had</p>
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
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
          <CheckCircle className="w-4 h-4" />
          <span>Free Forever — No Hidden Fees</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-3" data-testid="text-cta-heading">Your Skills Are Worth More Than You Think</h2>
        <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
          Stop paying for services you could trade for. That freelance designer needs accounting help. That lawyer needs a new website. That photographer needs someone to manage their social media.
        </p>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto font-medium">
          Everyone has something valuable to offer. <span className="text-primary">BarterConnect helps you find each other.</span>
        </p>
        <Link href={user ? "/app" : "/signup"}>
          <Button size="lg" className="gap-2" data-testid="button-join-now">
            Join the Community
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>

      <footer className="border-t py-6">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <Link href="/" className="flex items-center gap-0 shrink-0">
            <img src={logoPath} alt="BarterConnect" className="w-40" data-testid="footer-logo" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-foreground transition-colors" data-testid="link-terms">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors" data-testid="link-privacy">
              Privacy Policy
            </Link>
            <p>Trade skills, not cash.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
