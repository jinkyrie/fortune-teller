"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Order {
  id: string;
  fullName: string;
  email: string;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  queuePosition?: number;
  estimatedWaitTime?: number;
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number | null>(null);

  useEffect(() => {
    const orderId = searchParams.get('orderId') || searchParams.get('merchant_oid');
    
    if (orderId) {
      fetchOrderDetails(orderId);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const orderData = await response.json();
        setOrder(orderData);
        
        // Fetch current queue position
        fetchQueuePosition(orderId);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQueuePosition = async (orderId: string) => {
    try {
      const response = await fetch(`/api/queue/position/${orderId}`);
      if (response.ok) {
        const queueData = await response.json();
        setQueuePosition(queueData.position);
        setEstimatedWaitTime(queueData.estimatedWaitTime);
      }
    } catch (error) {
      console.error('Error fetching queue position:', error);
    }
  };

  // Update queue position every 30 seconds
  useEffect(() => {
    if (order?.id) {
      const interval = setInterval(() => {
        fetchQueuePosition(order.id);
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [order?.id]);

  if (loading) {
    return (
      <div className="min-h-screen celestial-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--muted)]">Verifying payment...</p>
        </div>
      </div>
    );
  }

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
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          </motion.div>
          
          <h1 className="font-cormorant text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
            Payment Successful!
          </h1>
          <p className="text-[var(--muted)] text-lg">
            Your payment has been processed successfully
          </p>
        </motion.div>

        <Card className="glass-card">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-6"
          >
            {order ? (
              <>
                <div className="text-center mb-6">
                  <h2 className="font-cormorant text-2xl font-bold text-[var(--foreground)] mb-2">
                    Order Confirmed
                  </h2>
                  <p className="text-[var(--muted)]">
                    Order #{order.id}
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[var(--primary)]" />
                    <span className="text-[var(--foreground)]">
                      Confirmation email sent to: <strong>{order.email}</strong>
                    </span>
                  </div>
                  
                  {queuePosition && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[var(--primary)]" />
                      <span className="text-[var(--foreground)]">
                        Current position in queue: <strong>#{queuePosition}</strong>
                      </span>
                    </div>
                  )}
                  
                  {estimatedWaitTime && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[var(--primary)]" />
                      <span className="text-[var(--foreground)]">
                        Estimated wait time: <strong>{estimatedWaitTime} minutes</strong>
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
                  <p className="text-green-500 font-semibold text-center">
                    Your fortune reading is now in our queue!
                  </p>
                  <p className="text-[var(--muted)] text-center mt-2">
                    Our professional fortune teller will begin working on your personalized reading shortly.
                    {queuePosition && (
                      <span className="block mt-2 text-sm">
                        You are currently position #{queuePosition} in the queue.
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href={`/status/${order.id}`} className="flex-1">
                    <Button className="btn-gold w-full">
                      Track Your Order
                    </Button>
                  </Link>
                  
                  <Link href="/" className="flex-1">
                    <Button variant="outline" className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black w-full">
                      Order Another Reading
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center">
                <h2 className="font-cormorant text-2xl font-bold text-[var(--foreground)] mb-4">
                  Payment Successful!
                </h2>
                <p className="text-[var(--muted)] mb-6">
                  Your payment has been processed. You will receive a confirmation email shortly.
                </p>
                <Link href="/">
                  <Button className="btn-gold">
                    Return Home
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </Card>
      </main>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen celestial-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--muted)]">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
