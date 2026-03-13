import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import logoPath from "@assets/BarterConnect_Logo_new.svg";

export const privacyContent = `1. Information We Collect

We may collect:
- Name
- Email address
- City/location
- Login credentials (encrypted)
- Usage data
- IP address
- Cookies/session data

2. How We Use Information

We use your data to:
- Operate and maintain the Platform
- Authenticate users
- Facilitate exchanges
- Communicate with you
- Improve services
- Prevent fraud

3. Sharing of Information

We do not sell personal data.

We may share information:
- With service providers
- If required by law
- To protect rights and safety
- During business transfers

4. Cookies

We use cookies and similar technologies to manage sessions and improve user experience.

5. Data Security

We use reasonable security measures to protect your data, but no system is 100% secure.

6. Data Retention

We retain data as long as necessary for platform operation or legal compliance.

7. Your Rights

You may request:
- Access to your data
- Correction
- Deletion (subject to legal obligations)

8. Children

BarterConnect is not intended for users under 18.

9. Changes

We may update this policy from time to time. Updated versions will be posted on the Platform. Continued use constitutes acceptance.`;

export default function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8E1BF] flex flex-col">
      <header className="bg-[#3d4a3c] border-b border-white/10 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/">
            <img src={logoPath} alt="BarterConnect" className="h-9" />
          </Link>
        </div>
      </header>

      <div className="flex-1 max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-[#3d4a3c]" data-testid="text-privacy-title">Privacy Policy</h1>
        <p className="text-sm text-[#869C84] font-medium mb-6">Last updated: February 2026</p>
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-[#4a3f3a]" data-testid="text-privacy-content">
          {privacyContent}
        </div>
      </div>

      <footer className="bg-[#3d4a3c] py-4 px-4">
        <div className="max-w-5xl mx-auto flex items-center">
          <img src={logoPath} alt="BarterConnect" className="w-36 opacity-90" />
        </div>
      </footer>
    </div>
  );
}
