import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
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
            Terms of Service
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-[var(--muted)] mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <h2 className="font-cormorant text-2xl font-semibold text-[var(--foreground)] mb-4">
              Acceptance of Terms
            </h2>
            <p className="text-[var(--muted)] mb-6">
              By accessing and using KahveYolu, you accept and agree to be bound by the 
              terms and provision of this agreement. If you do not agree to abide by the above, 
              please do not use this service.
            </p>

            <h2 className="font-cormorant text-2xl font-semibold text-[var(--foreground)] mb-4">
              Service Description
            </h2>
            <p className="text-[var(--muted)] mb-4">
              KahveYolu provides personalized coffee cup fortune reading services. Our services include:
            </p>
            <ul className="list-disc list-inside text-[var(--muted)] mb-6">
              <li>Professional coffee cup fortune reading analysis</li>
              <li>Personalized mystical insights based on coffee cup patterns</li>
              <li>Secure photo upload and analysis system</li>
              <li>Order tracking and status updates</li>
              <li>Email delivery of fortune reading results</li>
              <li>Customer support and communication</li>
            </ul>

            <h2 className="font-cormorant text-2xl font-semibold text-[var(--foreground)] mb-4">
              User Responsibilities
            </h2>
            <p className="text-[var(--muted)] mb-4">
              By using our service, you agree to:
            </p>
            <ul className="list-disc list-inside text-[var(--muted)] mb-6">
              <li>Provide accurate personal information</li>
              <li>Upload only coffee cup photos that you own or have permission to use</li>
              <li>Not upload inappropriate, offensive, or illegal content</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Use the service for personal, non-commercial purposes only</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>

            <h2 className="font-cormorant text-2xl font-semibold text-[var(--foreground)] mb-4">
              Payment Terms
            </h2>
            <p className="text-[var(--muted)] mb-4">
              Payment terms and conditions:
            </p>
            <ul className="list-disc list-inside text-[var(--muted)] mb-6">
              <li>Payment is required before service delivery</li>
              <li>We accept payments through Iyzico and PayTR payment gateways</li>
              <li>All prices are in Turkish Lira (TRY) unless otherwise specified</li>
              <li>Refunds are available within 24 hours of order placement if service has not been delivered</li>
              <li>Payment processing is handled securely by third-party providers</li>
            </ul>

            <h2 className="font-cormorant text-2xl font-semibold text-[var(--foreground)] mb-4">
              User Responsibilities
            </h2>
            <p className="text-[var(--muted)] mb-4">
              As a user of our service, you agree to:
            </p>
            <ul className="list-disc list-inside text-[var(--muted)] mb-6">
              <li>Provide accurate and complete information</li>
              <li>Upload only your own photos</li>
              <li>Respect our experts and staff</li>
              <li>Use the service for personal entertainment purposes only</li>
            </ul>

            <h2 className="font-cormorant text-2xl font-semibold text-[var(--foreground)] mb-4">
              Payment and Refunds
            </h2>
            <p className="text-[var(--muted)] mb-6">
              Payment is required before service delivery. Refunds are available within 24 hours 
              of order placement if the reading has not yet begun. No refunds are provided for 
              completed readings.
            </p>

            <h2 className="font-cormorant text-2xl font-semibold text-[var(--foreground)] mb-4">
              Limitation of Liability
            </h2>
            <p className="text-[var(--muted)] mb-6">
              Our fortune reading services are for entertainment purposes only. We do not guarantee 
              the accuracy of predictions and are not responsible for any decisions made based on 
              our readings. Users should not make important life decisions solely based on our services.
            </p>

            <h2 className="font-cormorant text-2xl font-semibold text-[var(--foreground)] mb-4">
              Contact Information
            </h2>
            <p className="text-[var(--muted)] mb-6">
              If you have any questions about these Terms of Service, please contact us at:
              <br />
              Email: support@kahveyolu.com
              <br />
              Website: https://kahveyolu.com
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

