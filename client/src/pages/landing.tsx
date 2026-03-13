import { Link } from "wouter";
import logoPath from "@assets/BarterConnect_Logo_cropped.png";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <Link href="/">
        <img src={logoPath} alt="BarterConnect" className="w-72 h-auto mb-8 cursor-pointer" />
      </Link>
      <h1 className="text-4xl font-bold text-foreground">BarterConnect</h1>
    </div>
  );
}
