import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Share2, Sparkles, Handshake, Search, MessageCircle, Star, Globe, CheckCircle, ChevronRight, Users, Zap, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useEffect, useRef } from "react";
import logoPath from "@assets/BarterConnect_Logo_new.svg";

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function LandingPage() {
  const { user } = useAuth();
  const revealRef1 = useScrollReveal();
  const revealRef2 = useScrollReveal();
  const revealRef3 = useScrollReveal();

  const features = [
    {
      icon: Globe,
      title: "Build Your Network, Your Way",
      desc: "Build real relationships with people whose talents complement yours. Your next go-to person is one barter away.",
      color: "bg-[#D99B42]",
    },
    {
      icon: Search,
      title: "Smart, Three-Tier Matching",
      desc: "Find perfect two-way matches, people who offer what you need, or people looking for exactly what you bring.",
      color: "bg-[#869C84]",
    },
    {
      icon: Handshake,
      title: "Trust-First Connections",
      desc: "Express interest, wait for mutual acceptance, and only then exchange contact info. Every connection starts with a handshake.",
      color: "bg-[#3d4a3c]",
    },
    {
      icon: Star,
      title: "Reputation That Follows You",
      desc: "Every completed barter builds your profile. The more you exchange, the more trusted you become.",
      color: "bg-[#B95755]",
    },
    {
      icon: MessageCircle,
      title: "Built-In Messaging",
      desc: "Chat directly within BarterConnect. No need to share personal emails or phone numbers until you're ready.",
      color: "bg-[#D99B42]",
    },
    {
      icon: Share2,
      title: "Shareable Barter Links",
      desc: "Create a shareable link and post it on LinkedIn, Facebook, or anywhere. Let the right people come to you.",
      color: "bg-[#869C84]",
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
    <div className="min-h-screen overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#3d4a3c]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-6 py-3">
          <Link href="/" className="shrink-0">
            <img src={logoPath} alt="BarterConnect" className="h-9" data-testid="header-logo" />
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/app">
                <Button className="bg-[#B95755] text-white hover:bg-[#a34a48] font-semibold rounded-full px-6 shadow-md" data-testid="button-go-dashboard">
                  Dashboard
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 rounded-full" data-testid="button-login">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-[#B95755] text-white hover:bg-[#a34a48] font-semibold rounded-full px-6 shadow-md" data-testid="button-signup">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-gradient-to-br from-[#869C84] via-[#748c72] to-[#5f7a5d]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-[#D99B42]/20 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-20 right-0 w-[500px] h-[500px] bg-[#F8E1BF]/15 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#3d4a3c]/20 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-20 w-full">
          <div className="max-w-3xl">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/12 text-white/90 text-sm font-medium mb-8 backdrop-blur-sm border border-white/12" data-testid="badge-platform">
                <Sparkles className="w-4 h-4 text-[#D99B42]" />
                <span>The skill-based networking platform</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.05]" data-testid="hero-heading">
                Trade Skills,
                <br />
                <span className="bg-gradient-to-r from-[#D99B42] via-[#F8E1BF] to-[#D99B42] bg-clip-text text-transparent animate-shimmer">
                  Not Cash.
                </span>
              </h1>
            </div>
            <div className="animate-fade-up stagger-2">
              <p className="text-2xl md:text-3xl font-bold text-[#F8E1BF] mb-6" data-testid="hero-subheading">
                It's all about networking.
              </p>
              <p className="text-lg text-white/65 max-w-xl mb-4 leading-relaxed">
                We all wish we knew a plumber, a lawyer, a web designer, a photographer, a marketing expert...
              </p>
              <p className="text-lg text-white/65 max-w-xl mb-10 leading-relaxed">
                <strong className="text-white">BarterConnect is exactly that.</strong> A community where people trade skills instead of dollars. You help someone with what you're great at, and they help you with what they're great at. Simple as that.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up stagger-4">
              <Link href={user ? "/app" : "/signup"}>
                <Button size="lg" className="bg-[#D99B42] text-white hover:bg-[#c48a35] font-semibold rounded-full px-8 py-6 text-lg gap-2 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300" data-testid="button-get-started">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="border-white/25 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg hover:border-white/45 transition-all duration-300" data-testid="button-learn-more">
                  How It Works
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </a>
            </div>
          </div>

          <div className="hidden lg:block absolute right-6 top-1/2 -translate-y-1/2">
            <img src={logoPath} alt="" className="w-72 opacity-40 animate-float-slow" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8E1BF] to-transparent" />
      </section>

      <section id="how-it-works" className="bg-[#F8E1BF] relative">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 scroll-reveal" ref={revealRef1}>
          <div className="text-center mb-16">
            <p className="text-sm font-bold tracking-[0.2em] uppercase text-[#869C84] mb-4">Simple Process</p>
            <h2 className="text-3xl md:text-5xl font-bold text-[#3d4a3c]" data-testid="text-how-it-works">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step) => (
              <div key={step.num}>
                <div className="group relative bg-white rounded-3xl p-8 h-full border border-[#e8d5b8] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#B95755]/8 to-transparent rounded-bl-full transition-all duration-500 group-hover:w-40 group-hover:h-40" />
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#B95755] text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <step.icon className="w-6 h-6" />
                      </div>
                      <span className="text-5xl font-black text-[#B95755]/12 group-hover:text-[#B95755]/20 transition-colors duration-300">{step.num}</span>
                    </div>
                    <h3 className="font-bold text-xl text-[#3d4a3c] mb-3">{step.title}</h3>
                    <p className="text-[#6b5c56] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#869C84] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#3d4a3c]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#F8E1BF]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 scroll-reveal" ref={revealRef2}>
          <div className="text-center mb-16">
            <p className="text-sm font-bold tracking-[0.2em] uppercase text-[#F8E1BF] mb-4">Why Us</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white" data-testid="text-why-barterconnect">
              Why Choose BarterConnect?
            </h2>
            <p className="text-white/60 mt-4 text-lg max-w-2xl mx-auto">
              More than just a marketplace — it's the network you always wished you had
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="group">
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-7 border border-white/12 hover:bg-white/18 hover:border-white/25 transition-all duration-500 hover:-translate-y-1 h-full">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${f.color} text-white mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-white mb-2 group-hover:text-[#F8E1BF] transition-colors duration-300">{f.title}</h3>
                  <p className="text-sm text-white/55 leading-relaxed group-hover:text-white/75 transition-colors duration-300">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#D99B42] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F8E1BF]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#3d4a3c]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        <div className="relative max-w-4xl mx-auto px-6 py-24 md:py-32 text-center scroll-reveal" ref={revealRef3}>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 text-white text-sm font-bold mb-8 border border-white/20">
            <CheckCircle className="w-4 h-4" />
            <span>Free Forever — No Hidden Fees</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight" data-testid="text-cta-heading">
            Your Skills Are Worth
            <br />
            <span className="bg-gradient-to-r from-[#3d4a3c] to-[#F8E1BF] bg-clip-text text-transparent">More Than You Think</span>
          </h2>
          <p className="text-lg text-white/75 mb-4 max-w-2xl mx-auto">
            Stop paying for services you could trade for. That freelance designer needs accounting help.
            That lawyer needs a new website. That photographer needs someone to manage their social media.
          </p>
          <p className="text-lg text-white mb-10 max-w-2xl mx-auto font-medium">
            Everyone has something valuable to offer.
          </p>
          <div>
            <Link href={user ? "/app" : "/signup"}>
              <Button size="lg" className="bg-[#3d4a3c] text-white hover:bg-[#4a5a48] font-semibold rounded-full px-10 py-6 text-lg gap-2 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300" data-testid="button-join-now">
                Join the Community
                <ArrowUpRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#3d4a3c]">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <Link href="/" className="shrink-0">
              <img src={logoPath} alt="BarterConnect" className="w-36 opacity-60 hover:opacity-100 transition-opacity duration-300" data-testid="footer-logo" />
            </Link>
            <div className="flex items-center gap-8 text-sm text-white/40">
              <Link href="/terms" className="hover:text-[#D99B42] transition-colors duration-300" data-testid="link-terms">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-[#D99B42] transition-colors duration-300" data-testid="link-privacy">
                Privacy
              </Link>
              <span className="text-white/25">Trade skills, not cash.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
