import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen celestial-gradient">
      <nav className="flex items-center p-6">
        <Link href="/" className="flex items-center gap-2 text-[var(--primary)] hover:text-[var(--secondary)] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pb-12">
        <div className="glass-card">
          <h1 className="font-cormorant text-4xl font-bold text-[var(--foreground)] mb-6 text-center">
            Privacy Policy
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-[var(--muted)] mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <h2 className="font-cormorant text-2xl font-semibold text-[var(--foreground)] mb-4">
              Information We Collect
            </h2>
            <p className="text-[var(--muted)] mb-4">
              KahveYolu collects the following information to provide our coffee cup fortune reading services:
            </p>
            <ul className="list-disc list-inside text-[var(--muted)] mb-6">
              <li><strong>Personal Information:</strong> Full name, email address, age, gender, marital status</li>
              <li><strong>Coffee Cup Photos:</strong> Images you upload for fortune reading analysis (stored securely on Cloudinary)</li>
              <li><strong>Payment Information:</strong> Processed securely by Iyzico and PayTR (we do not store payment details)</li>
              <li><strong>Account Information:</strong> Username, password (encrypted), account creation date</li>
              <li><strong>Order Information:</strong> Order details, status, completion date, fortune reading results</li>
              <li><strong>Communication Data:</strong> Messages, support requests, feedback</li>
            </ul>

            <h2 className="font-cormorant text-2xl font-semibold text-[var(--foreground)] mb-4">
              How We Use Your Information
            </h2>
            <p className="text-[var(--muted)] mb-4">
              We use your information for the following purposes:
            </p>
            <ul className="list-disc list-inside text-[var(--muted)] mb-6">
              <li><strong>Service Delivery:</strong> Provide coffee cup fortune reading services and deliver results</li>
              <li><strong>Account Management:</strong> Create and manage your user account, process orders</li>
              <li><strong>Payment Processing:</strong> Process payments through Iyzico and PayTR payment gateways</li>
              <li><strong>Communication:</strong> Send order confirmations, updates, and customer support</li>
              <li><strong>Image Analysis:</strong> Analyze uploaded coffee cup photos for fortune reading</li>
              <li><strong>Service Improvement:</strong> Improve our services and develop new features</li>
              <li><strong>Legal Compliance:</strong> Comply with applicable laws and regulations</li>
            </ul>

            <h2 className="font-cormorant text-2xl font-semibold text-[var(--foreground)] mb-4">
              Data Storage and Security
            </h2>
            <p className="text-[var(--muted)] mb-4">
              We implement appropriate security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside text-[var(--muted)] mb-6">
              <li><strong>Encryption:</strong> Passwords are encrypted using bcrypt hashing</li>
              <li><strong>Secure Storage:</strong> Images stored on Cloudinary with secure access controls</li>
              <li><strong>Payment Security:</strong> Payment processing handled by certified providers (Iyzico, PayTR)</li>
              <li><strong>Data Retention:</strong> Images automatically deleted after 2 weeks, account data retained as required by law</li>
              <li><strong>Access Controls:</strong> Limited access to personal data on a need-to-know basis</li>
            </ul>

            <h2 className="font-cormorant text-2xl font-semibold text-[var(--foreground)] mb-4">
              Your Rights
            </h2>
            <p className="text-[var(--muted)] mb-4">
              You have the following rights regarding your personal data:
            </p>
            <ul className="list-disc list-inside text-[var(--muted)] mb-6">
              <li><strong>Access:</strong> Request access to your personal data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Objection:</strong> Object to processing of your personal data</li>
              <li><strong>Withdrawal:</strong> Withdraw consent at any time</li>
            </ul>

            <h2 className="font-cormorant text-2xl font-semibold text-[var(--foreground)] mb-4">
              Information Sharing
            </h2>
            <p className="text-[var(--muted)] mb-6">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy. We may share your information 
              with trusted third parties who assist us in operating our website and conducting our business.
            </p>

            <h2 className="font-cormorant text-2xl font-semibold text-[var(--foreground)] mb-4">
              Data Security
            </h2>
            <p className="text-[var(--muted)] mb-6">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the internet is 100% secure.
            </p>

            <h2 className="font-cormorant text-2xl font-semibold text-[var(--foreground)] mb-4">
              Contact Us
            </h2>
            <p className="text-[var(--muted)] mb-6">
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              Email: privacy@mysticbrew.com
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

