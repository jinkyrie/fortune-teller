"use client";

import { useState, useEffect } from "react";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { isAdminEmail, getAdminEmail } from "@/lib/admin-config";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { User, Clock, CheckCircle, Coffee, Eye, RefreshCw, Download } from "lucide-react";
import AnimatedCoffeeCup from "@/components/animated-coffee-cup";
import { downloadReadingPDF } from "@/lib/pdf-generator";

interface Order {
  id: string;
  fullName: string;
  orderStatus: string;
  createdAt: string;
  completedAt?: string;
  queuePosition?: number;
  estimatedWaitTime?: number;
  readingContent?: string;
  readingNotes?: string;
  photos: string;
}

interface QueueInfo {
  position: number;
  estimatedWaitTime: number;
  status: string;
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [queueInfo, setQueueInfo] = useState<Record<string, QueueInfo>>({});

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
      return;
    }
    
    // Redirect admins to admin panel
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    
    if (user && isAdminEmail(userEmail)) {
      router.push("/admin");
      return;
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Real-time updates for all orders
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders(); // Refresh all orders to get status updates
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const handleDownloadPDF = (order: Order) => {
    if (!order.readingContent) return;
    
    const pdfData = {
      customerName: order.fullName,
      readingContent: order.readingContent,
      orderId: order.id,
      completedAt: order.completedAt || new Date().toISOString()
    };
    
    downloadReadingPDF(pdfData);
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/test-orders");
      if (response.ok) {
        const data = await response.json();
        // Parse photos from JSON string
        const ordersWithParsedPhotos = data.map((order: any) => ({
          ...order,
          photos: JSON.parse(order.photos || '[]')
        }));
        setOrders(ordersWithParsedPhotos);
        
        // Fetch queue info for queued orders
        const queuedOrders = ordersWithParsedPhotos.filter((order: Order) => order.orderStatus === 'queued');
        for (const order of queuedOrders) {
          await fetchQueueInfo(order.id);
        }
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQueueInfo = async (orderId: string) => {
    try {
      const response = await fetch(`/api/queue/position/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setQueueInfo(prev => ({
          ...prev,
          [orderId]: data
        }));
      }
    } catch (error) {
      console.error("Error fetching queue info:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "queued": return "bg-purple-500";
      case "in_progress": return "bg-blue-500";
      case "completed": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "queued": return <Coffee className="w-4 h-4" />;
      case "in_progress": return <Coffee className="w-4 h-4" />;
      case "completed": return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Pending";
      case "queued": return "In Queue";
      case "in_progress": return "In Progress";
      case "completed": return "Completed";
      default: return status.replace("_", " ");
    }
  };

  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen celestial-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen celestial-gradient">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <Link href="/" className="flex items-center gap-2 text-[var(--primary)] hover:text-[var(--secondary)] transition-colors">
          <span className="font-cormorant text-xl font-bold">KahveYolu</span>
          <AnimatedCoffeeCup size="small" />
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-[var(--foreground)]">Welcome, {user.fullName}</span>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
                userButtonPopoverCard: "bg-[#0B0C10] border border-[var(--border)] backdrop-blur-lg",
                userButtonPopoverActionButton: "text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black",
                userButtonPopoverFooter: "hidden",
              }
            }}
          />
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="font-cormorant text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
            Your Dashboard
          </h1>
          <p className="text-[var(--muted)] text-lg">
            Track your readings and view your order history
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="glass-card text-center">
            <div className="text-2xl font-bold text-[var(--foreground)] mb-1">
              {orders.length}
            </div>
            <div className="text-[var(--muted)]">Total Orders</div>
          </Card>
          <Card className="glass-card text-center">
            <div className="text-2xl font-bold text-yellow-500 mb-1">
              {orders.filter(o => o.orderStatus === "queued").length}
            </div>
            <div className="text-[var(--muted)]">In Queue</div>
          </Card>
          <Card className="glass-card text-center">
            <div className="text-2xl font-bold text-blue-500 mb-1">
              {orders.filter(o => o.orderStatus === "in_progress").length}
            </div>
            <div className="text-[var(--muted)]">In Progress</div>
          </Card>
          <Card className="glass-card text-center">
            <div className="text-2xl font-bold text-green-500 mb-1">
              {orders.filter(o => o.orderStatus === "completed").length}
            </div>
            <div className="text-[var(--muted)]">Completed</div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <Link href="/order" className="flex-1">
            <Button className="w-full btn-gold text-lg py-4">
              Order New Reading
            </Button>
          </Link>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </motion.div>

        {/* Orders List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-4"
        >
          <h2 className="font-cormorant text-2xl font-semibold text-[var(--foreground)] mb-4">
            Your Orders
          </h2>

          {orders.length === 0 ? (
            <Card className="glass-card text-center py-12">
              <div className="text-[var(--muted)]">
                <Coffee className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg">No orders yet</p>
                <p className="text-sm">Place your first order to get started</p>
              </div>
            </Card>
          ) : (
            orders.map((order, index) => {
              const queueData = queueInfo[order.id];
              const isQueued = order.orderStatus === 'queued';
              
              return (
                <Card key={order.id} className="glass-card">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-cormorant text-lg font-semibold text-[var(--foreground)]">
                          Order #{order.id.slice(-8)}
                        </h3>
                        <Badge className={`${getStatusColor(order.orderStatus)} text-white flex items-center gap-1`}>
                          {getStatusIcon(order.orderStatus)}
                          {getStatusText(order.orderStatus)}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-[var(--muted)]">
                        <p>Created: {new Date(order.createdAt).toLocaleDateString()}</p>
                        {order.completedAt && (
                          <p>Completed: {new Date(order.completedAt).toLocaleDateString()}</p>
                        )}
                        
                        {/* Queue Information */}
                        {isQueued && queueData && (
                          <div className="mt-2 p-3 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-[var(--primary)] font-semibold">
                                  Queue Position: #{queueData.position}
                                </p>
                                <p className="text-[var(--muted)] text-xs">
                                  Estimated wait: {formatWaitTime(queueData.estimatedWaitTime)}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center">
                                  <span className="text-black font-bold text-sm">
                                    {queueData.position}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Reading Content for Completed Orders */}
                        {order.orderStatus === 'completed' && order.readingContent && (
                          <div className="mt-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <h4 className="font-semibold text-green-500">Your Reading is Ready!</h4>
                              </div>
                              <Button
                                onClick={() => handleDownloadPDF(order)}
                                size="sm"
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                              </Button>
                            </div>
                            <div className="text-[var(--foreground)] whitespace-pre-wrap leading-relaxed">
                              {order.readingContent}
                            </div>
                          </div>
                        )}

                        {/* In Progress Status */}
                        {order.orderStatus === 'in_progress' && (
                          <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Coffee className="w-4 h-4 text-blue-500" />
                              <span className="text-blue-500 font-semibold">Your reading is being prepared...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Link href={`/status/${order.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </motion.div>
      </main>
    </div>
  );
}

