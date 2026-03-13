import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import logoPath from "@assets/BarterConnect_Logo_cropped.png";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <Link href="/" className="shrink-0 mb-8">
        <img src={logoPath} alt="BarterConnect" className="w-80 h-auto" data-testid="hero-logo" />
      </Link>
      <h1 className="text-4xl md:text-5xl font-bold text-foreground text-center">
        BarterConnect
      </h1>
      <p className="text-xl text-muted-foreground mt-4 text-center max-w-md">
        Trade skills, not cash.
      </p>
    </div>
  );
}
