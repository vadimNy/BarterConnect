import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import logoPath from "@assets/BarterConnect_Logo_new.svg";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      <header className="border-b px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center">
          <Link href="/">
            <img src={logoPath} alt="BarterConnect" className="h-12" />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="h-10 w-10 text-accent mx-auto" />
            <h1 className="text-2xl font-bold">Page Not Found</h1>
            <p className="text-sm text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <footer className="border-t py-4 px-4">
        <div className="max-w-5xl mx-auto flex items-center">
          <img src={logoPath} alt="BarterConnect" className="w-36" />
        </div>
      </footer>
    </div>
  );
}
