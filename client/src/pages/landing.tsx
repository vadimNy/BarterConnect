import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Share2, Sparkles, Handshake, Search, MessageCircle, Star, Globe, CheckCircle, ChevronRight, Users, Zap } from "lucide-react";
import { useAuth } from "@/lib/auth";
import logoPath from "@assets/BarterConnect_Logo_new.svg";

export default function LandingPage() {
  const { user } = useAuth();

  const features = [
    {
      icon: Globe,
      title: "Build Your Network, Your Way",
      desc: "Build real relationships with people whose talents complement yours. Your next go-to person is one barter away.",
    },
    {
      icon: Search,
      title: "Smart, Three-Tier Matching",
      desc: "Find perfect two-way matches, people who offer what you need, or people looking for exactly what you bring.",
    },
    {
      icon: Handshake,
      title: "Trust-First Connections",
      desc: "Express interest, wait for mutual acceptance, and only then exchange contact info. Every connection starts with a handshake.",
    },
    {
      icon: Star,
      title: "Reputation That Follows You",
      desc: "Every completed barter builds your profile. The more you exchange, the more trusted you become.",
    },
    {
      icon: MessageCircle,
      title: "Built-In Messaging",
      desc: "Chat directly within BarterConnect. No need to share personal emails or phone numbers until you    're ready.",
    },
    {
      icon: Share2,
      title: "Shareable Barter Links",
      desc: "Create a shareable link and post it on LinkedIn, Facebook, or anywhere. Let the right people come to you.",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Post What You Offer & Need",
      desc: "Describe the skill you can offer and what you're looking for. Web design, legal advice, photography, marketing — if you have it, someone needs it.",
      icon: Zap,
    },
    {
      num: "02",
      title: "Get Matched Instantly",
      desc: "Our three-tier matching system finds perfect matches, people offering what you need, and people looking for your skills.",
      icon: Users,
    },
    {
      num: "03",
      title: "Connect & Exchange",
      desc: "Send interest, get accepted, chat, and complete the exchange. Build your reputation and grow your network — one barter at a time.",
      icon: Handshake,
    },
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-[hsl(165,30%,42%)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="shrink-0">
            <img src={logoPath} alt="BarterConnect" className="h-10" data-testid="header-logo" />
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/app">
                <Button className="bg-[#f3eddf] text-[hsl(165,30%,25%)] hover:bg-[#f3eddf]/90 font-semibold rounded-full px-6" data-testid="button-go-dashboard">
                  Dashboard
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-[#f3eddf] hover:bg-white/10 rounded-full" data-testid="button-login">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-[#f3eddf] text-[hsl(165,30%,25%)] hover:bg-[#f3eddf]/90 font-semibold rounded-full px-6" data-testid="button-signup">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative bg-[hsl(165,30%,42%)] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-[#f3eddf] text-sm font-medium mb-8 backdrop-blur-sm" data-testid="badge-platform">
              <Sparkles className="w-4 h-4" />
              <span>The skill-based networking platform</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#f3eddf] mb-6 leading-[1.1]" data-testid="hero-heading">
              Trade Skills,
              <br />
              <span className="text-white">Not Cash.</span>
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-white/90 mb-6" data-testid="hero-subheading">
              It's all about networking.
            </p>
            <p className="text-lg text-[#f3eddf]/80 max-w-xl mb-4 leading-relaxed">
              We all wish we knew a plumber, a lawyer, a web designer, a photographer, a marketing expert...
            </p>
            <p className="text-lg text-[#f3eddf]/80 max-w-xl mb-10 leading-relaxed">
              <strong className="text-white">BarterConnect is exactly that.</strong> A community where people trade skills instead of dollars. You help someone with what you're great at, and they help you with what they're great at. Simple as that.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={user ? "/app" : "/signup"}>
                <Button size="lg" className="bg-[#f3eddf] text-[hsl(165,30%,25%)] hover:bg-white font-semibold rounded-full px-8 py-6 text-lg gap-2 shadow-lg" data-testid="button-get-started">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="border-[#f3eddf]/30 text-[#f3eddf] hover:bg-white/10 rounded-full px-8 py-6 text-lg" data-testid="button-learn-more">
                  How It Works
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </a>
            </div>
          </div>
          <div className="hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2">
            <img src={logoPath} alt="" className="w-80 opacity-40" />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-[#f3eddf]">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase text-[hsl(165,30%,42%)] mb-3">Simple Process</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(165,35%,20%)]" data-testid="text-how-it-works">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step) => (
              <div key={step.num} className="relative group">
                <div className="bg-white rounded-2xl p-8 h-full border border-[hsl(165,15%,83%)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[hsl(165,30%,42%)] text-[#f3eddf]">
                      <step.icon className="w-6 h-6" />
                    </div>
                    <span className="text-4xl font-bold text-[hsl(165,30%,42%)]/20">{step.num}</span>
                  </div>
                  <h3 className="font-bold text-xl text-[hsl(165,35%,20%)] mb-3">{step.title}</h3>
                  <p className="text-[hsl(165,15%,40%)] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[hsl(165,30%,42%)]">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase text-[#f3eddf]/70 mb-3">Why Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#f3eddf]" data-testid="text-why-barterconnect">
              Why Choose BarterConnect?
            </h2>
            <p className="text-[#f3eddf]/70 mt-4 text-lg max-w-2xl mx-auto">
              More than just a marketplace — it's the network you always wished you had
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#f3eddf]/20 text-[#f3eddf] mb-5">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[#f3eddf] mb-2">{f.title}</h3>
                <p className="text-sm text-[#f3eddf]/70 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f3eddf]">
        <div className="max-w-4xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(165,30%,42%)]/10 text-[hsl(165,30%,42%)] text-sm font-semibold mb-8">
            <CheckCircle className="w-4 h-4" />
            <span>Free Forever — No Hidden Fees</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(165,35%,20%)] mb-6 leading-tight" data-testid="text-cta-heading">
            Your Skills Are Worth
            <br />
            <span className="text-[hsl(165,30%,42%)]">More Than You Think</span>
          </h2>
          <p className="text-lg text-[hsl(165,15%,40%)] mb-4 max-w-2xl mx-auto">
            Stop paying for services you could trade for. That freelance designer needs accounting help.
            That lawyer needs a new website. That photographer needs someone to manage their social media.
          </p>
          <p className="text-lg text-[hsl(165,15%,40%)] mb-10 max-w-2xl mx-auto font-medium">
            Everyone has something valuable to offer.
          </p>
          <Link href={user ? "/app" : "/signup"}>
            <Button size="lg" className="bg-[hsl(165,30%,42%)] text-[#f3eddf] hover:bg-[hsl(165,30%,37%)] font-semibold rounded-full px-10 py-6 text-lg gap-2 shadow-lg" data-testid="button-join-now">
              Join the Community
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-[hsl(165,30%,25%)]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="shrink-0">
            <img src={logoPath} alt="BarterConnect" className="w-36 opacity-80" data-testid="footer-logo" />
          </Link>
          <div className="flex items-center gap-6 text-sm text-[#f3eddf]/60">
            <Link href="/terms" className="hover:text-[#f3eddf] transition-colors" data-testid="link-terms">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-[#f3eddf] transition-colors" data-testid="link-privacy">
              Privacy
            </Link>
            <span>Trade skills, not cash.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
