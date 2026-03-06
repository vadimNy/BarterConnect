import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import logoPath from "@assets/BarterConnect_Logo_cropped.png";

export const tosContent = `1. Acceptance of Terms

By accessing or using BarterConnect ("Platform," "we," "us," "our"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, you may not use the Platform.

2. Description of Service

BarterConnect is an online platform that allows users to connect and exchange professional and personal services through barter arrangements. BarterConnect does not provide, supervise, endorse, or guarantee any services offered by users.

We act solely as a technology platform to facilitate connections between users.

3. Eligibility

You must be at least 18 years old to use the Platform. By using BarterConnect, you represent that you are legally able to enter into binding agreements.

4. Accounts and Security

You are responsible for:
- Maintaining the confidentiality of your login credentials
- All activity that occurs under your account
- Providing accurate and current information

You agree to notify us immediately of any unauthorized use.

We reserve the right to suspend or terminate accounts for violations of these Terms.

5. User Conduct

You agree not to:
- Misrepresent your skills, identity, or credentials
- Offer illegal, fraudulent, or prohibited services
- Harass, threaten, or abuse other users
- Use the Platform for unlawful purposes
- Attempt to access systems without authorization
- Circumvent platform safeguards

We may remove content or accounts at our discretion.

6. Professional Disclaimer

BarterConnect does not verify professional licenses, certifications, or qualifications.

Users offering professional services (including legal, financial, medical, technical, or trade services) do so at their own risk.

You acknowledge that:
- We do not guarantee service quality
- We do not evaluate competence
- We do not supervise exchanges
- All professional services are provided solely between users

7. Barter Transactions

All barter arrangements are private agreements between users.

BarterConnect:
- Is not a party to any exchange
- Does not guarantee completion
- Does not enforce performance
- Does not resolve contractual disputes

Users are solely responsible for fulfilling their obligations.

8. In-Person Interactions

Some exchanges may involve in-person meetings.

You acknowledge and agree that:
- In-person interactions carry inherent risks
- You are responsible for your own safety
- BarterConnect is not responsible for incidents, injuries, theft, or damages

We encourage meeting in public places when possible and exercising reasonable caution.

9. Payments and Future Monetization

Currently, BarterConnect does not charge fees.

We reserve the right to introduce paid features, subscriptions, or fees in the future with reasonable notice.

Continued use constitutes acceptance of updated terms.

10. Content Ownership

You retain ownership of content you submit.

By posting content, you grant BarterConnect a non-exclusive, royalty-free license to use, display, and distribute such content for platform operation.

11. Privacy

Your use of the Platform is subject to our Privacy Policy.

12. Termination

We may suspend or terminate your access at any time for violations of these Terms or for any reason at our discretion.

You may terminate your account at any time.

13. Disclaimer of Warranties

The Platform is provided "AS IS" and "AS AVAILABLE."

We make no warranties regarding:
- Accuracy
- Reliability
- Availability
- Security
- Service outcomes

Use is at your own risk.

14. Limitation of Liability

To the maximum extent permitted by law, BarterConnect and its owners shall not be liable for:
- Personal injury
- Property damage
- Financial loss
- Professional harm
- Lost profits
- Disputes between users

Our total liability shall not exceed $100 or the amount you paid us (if any), whichever is greater.

15. Indemnification

You agree to indemnify and hold harmless BarterConnect from any claims arising from:
- Your use of the Platform
- Your exchanges
- Your violations of these Terms
- Your interactions with other users

16. Governing Law

These Terms are governed by the laws of the State of New York, USA, without regard to conflict of law principles.

17. Changes to Terms

We may modify these Terms at any time. Updated versions will be posted on the Platform.

Continued use constitutes acceptance.`;

export const professionalDisclaimerContent = `BarterConnect is a technology platform that enables users to connect for the exchange of services. BarterConnect does not provide professional services and does not employ, endorse, certify, or supervise any users offering services through the Platform.

Users may offer professional services including, but not limited to, legal, financial, medical, technical, trade, consulting, or other regulated services. BarterConnect:
- Does not verify licenses, certifications, insurance coverage, or credentials
- Does not guarantee qualifications, competence, or service outcomes
- Does not provide professional advice of any kind

Any professional services exchanged through the Platform are provided solely between users. Users are solely responsible for:
- Confirming the qualifications and licensing of other users
- Evaluating risks
- Complying with applicable laws and professional regulations

Nothing on BarterConnect constitutes legal, financial, medical, tax, or professional advice.

Use of professional services arranged through the Platform is at your own risk.`;

export const taxDisclaimerContent = `Barter transactions may have tax consequences under applicable federal, state, or local laws.

In the United States, barter exchanges may be treated as taxable income by the Internal Revenue Service (IRS). Users are solely responsible for:
- Determining whether a barter transaction constitutes taxable income
- Reporting any required income
- Maintaining appropriate records
- Paying any applicable taxes

BarterConnect does not provide tax advice and does not calculate, withhold, report, or remit taxes on behalf of users.

Users should consult a qualified tax professional regarding their obligations.

BarterConnect disclaims any liability arising from a user's failure to comply with tax laws.`;

export const platformRoleDisclaimerContent = `BarterConnect is a neutral intermediary platform.

We:
- Do not act as an agent, broker, contractor, employer, or partner of any user
- Are not a party to any barter agreement
- Do not control, supervise, or enforce user transactions
- Do not guarantee completion of services

Any agreement formed between users is a direct agreement between those users.

BarterConnect is not responsible for:
- Non-performance
- Misrepresentation
- Professional negligence
- Personal injury
- Property damage
- Financial loss
- Disputes between users

Users assume full responsibility for their interactions and transactions.`;

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/">
            <img src={logoPath} alt="BarterConnect" className="h-12" />
          </Link>
        </div>
      </header>

      <div className="flex-1 max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="text-terms-title">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-6">Last updated: March 2026</p>
        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed" data-testid="text-terms-content">
          {tosContent}
        </div>

        <hr className="my-10 border-border" />

        <h2 className="text-2xl font-bold mb-2" data-testid="text-professional-disclaimer-title">Addendum A: Professional Services Disclaimer</h2>
        <p className="text-sm text-muted-foreground mb-6">Effective: March 2026</p>
        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed" data-testid="text-professional-disclaimer-content">
          {professionalDisclaimerContent}
        </div>

        <hr className="my-10 border-border" />

        <h2 className="text-2xl font-bold mb-2" data-testid="text-tax-disclaimer-title">Addendum B: Tax Disclaimer</h2>
        <p className="text-sm text-muted-foreground mb-6">Effective: March 2026</p>
        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed" data-testid="text-tax-disclaimer-content">
          {taxDisclaimerContent}
        </div>

        <hr className="my-10 border-border" />

        <h2 className="text-2xl font-bold mb-2" data-testid="text-platform-role-disclaimer-title">Addendum C: Platform Role Disclaimer</h2>
        <p className="text-sm text-muted-foreground mb-6">Effective: March 2026</p>
        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed" data-testid="text-platform-role-disclaimer-content">
          {platformRoleDisclaimerContent}
        </div>
      </div>

      <footer className="border-t py-4 px-4">
        <div className="max-w-5xl mx-auto flex items-center">
          <img src={logoPath} alt="BarterConnect" className="w-36" />
        </div>
      </footer>
    </div>
  );
}
