"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AnimatedCoffeeCup from "@/components/animated-coffee-cup";
import { AdminOnly } from "@/components/admin-only";
import { useUser, SignInButton, SignUpButton, UserButton, useClerk } from "@clerk/nextjs";
import { isAdminEmail } from "@/lib/admin-config";

export default function Home() {
  const { user, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  // No need for redirect logic here since we're using URL parameters

  const handleBeginReading = () => {
    if (user) {
      // User is logged in, redirect to order form
      router.push("/order");
    } else {
      // User is not logged in, redirect to sign-in with order intent
      router.push("/sign-in?redirect_to=order");
    }
  };



  return (
    <div className="min-h-screen celestial-gradient">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <span className="font-cormorant text-2xl font-bold text-[var(--primary)]">
            KahveYolu
          </span>
          <AnimatedCoffeeCup size="small" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-4"
        >
          {!isLoaded ? (
            <div className="w-20 h-10 bg-gray-300 animate-pulse rounded"></div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black">
                  {isAdminEmail(user.primaryEmailAddress?.emailAddress) ? "Admin Panel" : "Dashboard"}
                </Button>
              </Link>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard: "bg-[#0B0C10] border border-[var(--border)] backdrop-blur-lg",
                    userButtonPopoverActionButton: "text-[var(--foreground)] hover:bg-[var(--primary)]/10",
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <SignInButton mode="modal">
                <Button 
                  variant="outline" 
                  className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black"
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="btn-gold">
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          )}
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto w-full"
        >
          <h1 className="font-cormorant text-6xl md:text-8xl font-bold text-[var(--foreground)] mb-6">
            Discover Your
            <span className="block text-[var(--primary)] mystic-glow">Destiny</span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl text-[var(--muted)] mb-8 max-w-2xl mx-auto"
          >
            Unlock the ancient secrets hidden in your coffee cup with our mystical readings. 
            Experience a premium, personalized journey into your future.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center items-center"
          >
            <Button 
              onClick={handleBeginReading}
              className="btn-gold text-lg px-8 py-4 h-auto"
            >
              Begin Your Reading
            </Button>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto px-6"
        >
          <Card className="glass-card text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-4 group-hover:animate-pulse">☕</div>
            <h3 className="font-cormorant text-xl font-semibold mb-2 text-[var(--primary)]">Ancient Wisdom</h3>
            <p className="text-[var(--muted)]">Master fortune tellers with decades of mystical experience</p>
          </Card>
          
          <Card className="glass-card text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-4 group-hover:animate-pulse">✨</div>
            <h3 className="font-cormorant text-xl font-semibold mb-2 text-[var(--primary)]">Premium Experience</h3>
            <p className="text-[var(--muted)]">Luxurious, personalized readings crafted just for you</p>
          </Card>
          
          <Card className="glass-card text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-4 group-hover:animate-pulse">🔮</div>
            <h3 className="font-cormorant text-xl font-semibold mb-2 text-[var(--primary)]">Mystical Insights</h3>
            <p className="text-[var(--muted)]">Reveal hidden truths through your coffee cup's patterns</p>
          </Card>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-16 p-6 text-center text-[var(--muted)]">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/legal/privacy" className="hover:text-[var(--primary)] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/legal/terms" className="hover:text-[var(--primary)] transition-colors">
            Terms of Service
          </Link>
          <Link href="/legal/kvkk" className="hover:text-[var(--primary)] transition-colors">
            KVKK
          </Link>
        </div>
        <p>&copy; {new Date().getFullYear()} KahveYolu. All rights reserved.</p>
      </footer>
    </div>
  );
}
