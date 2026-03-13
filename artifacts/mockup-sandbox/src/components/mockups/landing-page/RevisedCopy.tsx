import { ArrowRight, Users, Share2, Shield, Sparkles, Handshake, Repeat, Search, MessageCircle, Star, Globe, CheckCircle } from "lucide-react";

export function RevisedCopy() {
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
      desc: "Our three-tier matching system goes to work instantly. We'll show you perfect two-way matches, people who offer what you need, and people who are looking for exactly what you bring to the table. No browsing through endless listings — we do the matchmaking for you.",
    },
    {
      num: "3",
      title: "Connect, Chat & Exchange Skills",
      desc: "Found someone interesting? Send them an interest request. Once they accept, you'll be connected with built-in messaging to work out the details. Complete the exchange, build your reputation, and grow your network — one barter at a time.",
    },
  ];

  return (
    <div className="min-h-screen bg-[hsl(270,40%,92%)] text-[hsl(270,45%,22%)]" style={{ fontFamily: "'Open Sans', sans-serif" }}>
      <header className="sticky top-0 z-50 border-b border-[hsl(270,20%,85%)] bg-[hsl(270,40%,92%)]/95 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <img src="/__mockup/images/BarterConnect_Logo_cropped.png" alt="BarterConnect" className="h-12" />
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm font-medium text-[hsl(270,45%,22%)] hover:bg-[hsl(270,18%,88%)] rounded-md transition-colors">Log in</button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-[hsl(270,55%,38%)] hover:bg-[hsl(270,55%,33%)] rounded-md transition-colors">Sign up</button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(270,55%,38%)]/10 via-[hsl(270,40%,92%)] to-[hsl(25,85%,50%)]/10" />
        <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="flex justify-center mb-8">
            <img src="/__mockup/images/BarterConnect_Logo_cropped.png" alt="BarterConnect" className="w-64 md:w-80 lg:w-96" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[hsl(270,55%,38%)]/10 text-[hsl(270,55%,38%)] text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The skill-based networking platform</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Trade Skills,{" "}
            <span className="text-[hsl(25,85%,50%)]">Not Cash.</span>
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-[hsl(270,45%,22%)] max-w-3xl mx-auto mb-4">
            It's all about networking.
          </p>
          <p className="text-lg md:text-xl text-[hsl(270,20%,45%)] max-w-2xl mx-auto mb-4">
            We all wish we knew a plumber, a lawyer, a web designer, a photographer, a marketing expert...
          </p>
          <p className="text-lg md:text-xl text-[hsl(270,20%,45%)] max-w-2xl mx-auto mb-8">
            <strong className="text-[hsl(270,55%,38%)]">BarterConnect is exactly that.</strong> A community where people trade skills instead of dollars. You help someone with what you're great at, and they help you with what they're great at. Simple as that.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-white bg-[hsl(270,55%,38%)] hover:bg-[hsl(270,55%,33%)] rounded-md transition-colors">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-[hsl(270,45%,22%)] border border-[hsl(270,20%,85%)] hover:bg-[hsl(270,18%,88%)] rounded-md transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">How It Works</h2>
          <p className="text-[hsl(270,20%,45%)]">Getting started is easy — and it's completely free</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[hsl(25,85%,50%)] text-white text-xl font-bold mb-4">
                {step.num}
              </div>
              <h3 className="font-semibold text-lg mb-3">{step.title}</h3>
              <p className="text-[hsl(270,20%,45%)] text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[hsl(270,30%,97%)] border-y border-[hsl(270,20%,85%)]">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Why Choose BarterConnect?</h2>
            <p className="text-[hsl(270,20%,45%)]">More than just a marketplace — it's the network you always wished you had</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-lg border border-[hsl(270,15%,88%)] p-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-[hsl(25,85%,50%)]/15 text-[hsl(25,85%,50%)] shrink-0">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{f.title}</h3>
                    <p className="text-sm text-[hsl(270,20%,45%)] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(25,85%,50%)]/10 text-[hsl(25,85%,50%)] text-sm font-medium mb-6">
          <CheckCircle className="w-4 h-4" />
          <span>Free Forever — No Hidden Fees</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Your Skills Are Worth More Than You Think</h2>
        <p className="text-[hsl(270,20%,45%)] mb-4 max-w-2xl mx-auto">
          Stop paying for services you could trade for. That freelance designer needs accounting help. That lawyer needs a new website. That photographer needs someone to manage their social media.
        </p>
        <p className="text-[hsl(270,20%,45%)] mb-8 max-w-2xl mx-auto font-medium">
          Everyone has something valuable to offer. <span className="text-[hsl(270,55%,38%)]">BarterConnect helps you find each other.</span>
        </p>
        <button className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-white bg-[hsl(270,55%,38%)] hover:bg-[hsl(270,55%,33%)] rounded-md transition-colors">
          Join the Community
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      <footer className="border-t border-[hsl(270,20%,85%)] py-6">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[hsl(270,20%,45%)]">
          <img src="/__mockup/images/BarterConnect_Logo_cropped.png" alt="BarterConnect" className="w-40" />
          <div className="flex items-center gap-4">
            <span className="hover:text-[hsl(270,45%,22%)] transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-[hsl(270,45%,22%)] transition-colors cursor-pointer">Privacy Policy</span>
            <p>Trade skills, not cash.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
