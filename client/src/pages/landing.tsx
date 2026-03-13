import logoPath from "@assets/BarterConnect_Logo_cropped.png";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <img src={logoPath} alt="BarterConnect" className="h-20 w-auto object-contain" data-testid="landing-logo" />
        <h1 className="text-3xl font-bold">BarterConnect</h1>
      </div>
    </div>
  );
}
