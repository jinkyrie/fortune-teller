"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle, Coffee, Download } from "lucide-react";
import { useUser, UserButton } from "@clerk/nextjs";
import { downloadReadingPDF } from "@/lib/pdf-generator";

interface Order {
  id: string;
  fullName: string;
  orderStatus: string;
  createdAt: string;
  completedAt?: string;
  estimatedTime: number; // in minutes
  readingContent?: string;
}

interface StatusPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function StatusPage({ params }: StatusPageProps) {
  const { id } = use(params);
  const { user } = useUser();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`);
        if (response.ok) {
          const orderData = await response.json();
          setOrder({
            ...orderData,
            estimatedTime: 40 // Default estimated time
          });
        } else {
          console.error('Failed to fetch order');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (order && order.orderStatus === "pending") {
      const interval = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [order]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-8 h-8 text-yellow-500" />;
      case "in_progress":
        return <Coffee className="w-8 h-8 text-blue-500" />;
      case "completed":
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      default:
        return <Clock className="w-8 h-8 text-gray-500" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "pending":
        return "Your reading is in the queue. Our professional fortune teller will begin shortly.";
      case "in_progress":
        return "Your reading is being prepared by our professional fortune teller.";
      case "completed":
        return "Your reading is ready! Check your email for the complete reading.";
      default:
        return "Processing your request...";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "in_progress":
        return "text-blue-500";
      case "completed":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const handleDownloadPDF = () => {
    if (!order?.readingContent) return;
    
    const pdfData = {
      customerName: order.fullName,
      readingContent: order.readingContent,
      orderId: order.id,
      completedAt: order.completedAt || new Date().toISOString()
    };
    
    downloadReadingPDF(pdfData);
  };

  if (loading) {
    return (
      <div className="min-h-screen celestial-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--muted)]">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen celestial-gradient flex items-center justify-center">
        <Card className="glass-card text-center p-8">
          <h1 className="font-cormorant text-2xl font-bold text-[var(--foreground)] mb-4">
            Order Not Found
          </h1>
          <p className="text-[var(--muted)] mb-6">
            The order you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/">
            <Button className="btn-gold">
              Return Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen celestial-gradient">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <Link href="/" className="flex items-center gap-2 text-[var(--primary)] hover:text-[var(--secondary)] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        {user && (
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
                userButtonPopoverCard: "bg-[#0B0C10] border border-[var(--border)] backdrop-blur-lg",
                userButtonPopoverActionButton: "text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black",
                userButtonPopoverFooter: "hidden",
              }
            }}
          />
        )}
      </nav>

      <main className="max-w-2xl mx-auto px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="font-cormorant text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
            Your Reading Status
          </h1>
          <p className="text-[var(--muted)] text-lg">
            Order #{order.id}
          </p>
        </motion.div>

        <Card className="glass-card text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6"
          >
            {getStatusIcon(order.orderStatus)}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className={`font-cormorant text-2xl font-bold mb-4 ${getStatusColor(order.orderStatus)}`}
          >
            {order.orderStatus.replace("_", " ").toUpperCase()}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-[var(--muted)] text-lg mb-6"
          >
            {getStatusMessage(order.orderStatus)}
          </motion.p>

          {order.orderStatus === "pending" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6"
            >
              <p className="text-yellow-500 font-semibold">
                Estimated time remaining: {order.estimatedTime} minutes
              </p>
            </motion.div>
          )}

          {order.orderStatus === "completed" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="space-y-4"
            >
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-green-500 font-semibold mb-2">
                      Your reading is ready!
                    </p>
                    <p className="text-[var(--muted)]">
                      Your personalized reading has been completed.
                    </p>
                  </div>
                  {order.readingContent && (
                    <Button
                      onClick={handleDownloadPDF}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  )}
                </div>
                
                {order.readingContent && (
                  <div className="mt-4 p-4 bg-[var(--background)]/50 border border-[var(--border)] rounded-lg">
                    <h4 className="font-semibold text-[var(--foreground)] mb-3">Your Fortune Reading:</h4>
                    <div className="text-[var(--foreground)] whitespace-pre-wrap leading-relaxed">
                      {order.readingContent}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="text-sm text-[var(--muted)] mt-6"
          >
            <p>Order placed: {new Date(order.createdAt).toLocaleString()}</p>
            {order.completedAt && (
              <p>Completed: {new Date(order.completedAt).toLocaleString()}</p>
            )}
          </motion.div>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="text-center mt-8 space-x-4"
        >
          <Link href="/dashboard">
            <Button variant="outline" className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black">
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black">
              Order Another Reading
            </Button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
