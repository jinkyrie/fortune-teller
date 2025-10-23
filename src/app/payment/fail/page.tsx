"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function PaymentFailPage() {
  return (
    <div className="min-h-screen celestial-gradient">
      {/* Navigation */}
      <nav className="flex items-center p-6">
        <Link href="/" className="flex items-center gap-2 text-[var(--primary)] hover:text-[var(--secondary)] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <XCircle className="w-20 h-20 text-red-500 mx-auto" />
          </motion.div>
          
          <h1 className="font-cormorant text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
            Payment Failed
          </h1>
          <p className="text-[var(--muted)] text-lg">
            Unfortunately, your payment could not be processed
          </p>
        </motion.div>

        <Card className="glass-card">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-6 text-center"
          >
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-red-500 font-semibold mb-2">
                Payment Processing Error
              </p>
              <p className="text-[var(--muted)]">
                There was an issue processing your payment. This could be due to insufficient funds, 
                incorrect card information, or a temporary issue with your bank.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="font-cormorant text-xl font-bold text-[var(--foreground)]">
                What you can do:
              </h3>
              <ul className="text-[var(--muted)] space-y-2 text-left">
                <li>• Check your card information and try again</li>
                <li>• Ensure you have sufficient funds in your account</li>
                <li>• Contact your bank if the issue persists</li>
                <li>• Try using a different payment method</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/order" className="flex-1">
                <Button className="btn-gold w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </Link>
              
              <Link href="/" className="flex-1">
                <Button variant="outline" className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black w-full">
                  Return Home
                </Button>
              </Link>
            </div>
          </motion.div>
        </Card>
      </main>
    </div>
  );
}
