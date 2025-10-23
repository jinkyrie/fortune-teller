"use client";

import { useState, useEffect } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { isAdminEmail, getAdminEmail } from "@/lib/admin-config";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Eye, Mail, Clock, CheckCircle } from "lucide-react";
import OrderDetailModal from "@/components/admin/order-detail-modal";
import QueueManagement from "@/components/admin/queue-management";
import AnimatedCoffeeCup from "@/components/animated-coffee-cup";

interface Order {
  id: string;
  fullName: string;
  age: number;
  maritalStatus: string;
  gender: string;
  email: string;
  photos: string[];
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  completedAt?: string;
  paymentProvider?: string;
  paidAmount?: number;
  paymentCurrency?: string;
  readingContent?: string;
  readingNotes?: string;
}

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'queue'>('orders');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Check authentication (allow any authenticated user for testing)
  useEffect(() => {
    if (!isLoaded) return; // Still loading
    
    if (!user) {
      router.push("/sign-in");
      return;
    }
    
    console.log('✅ User authenticated:', user.primaryEmailAddress?.emailAddress);
  }, [user, isLoaded, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          const ordersData = await response.json();
          // Parse photos from JSON string
          const ordersWithParsedPhotos = ordersData.map((order: any) => ({
            ...order,
            photos: JSON.parse(order.photos || '[]')
          }));
          setOrders(ordersWithParsedPhotos);
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Failed to fetch orders:', response.status, errorData);
          // If it's an auth error, redirect to sign-in
          if (response.status === 401 || response.status === 403) {
            router.push('/sign-in');
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch orders if user is authenticated
    if (user) {
      fetchOrders();
    } else if (isLoaded) {
      // User is loaded but not authenticated, don't fetch orders
      setLoading(false);
    }
  }, [user, isLoaded, router, refreshTrigger]);

  // Refresh orders when switching to All Orders tab
  useEffect(() => {
    if (activeTab === 'orders' && user) {
      const fetchOrders = async () => {
        setRefreshing(true);
        try {
          const response = await fetch('/api/orders');
          if (response.ok) {
            const ordersData = await response.json();
            const ordersWithParsedPhotos = ordersData.map((order: any) => ({
              ...order,
              photos: JSON.parse(order.photos || '[]')
            }));
            setOrders(ordersWithParsedPhotos);
          }
        } catch (error) {
          console.error('Error refreshing orders:', error);
        } finally {
          setRefreshing(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab, user]);

  // Removed handleStatusChange - status management is now handled in Queue Management tab

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "in_progress": return "bg-blue-500";
      case "completed": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  // No filtering needed - show all orders as overview

  // Show loading while checking authentication
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen celestial-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--muted)]">
            {!isLoaded ? "Authenticating..." : "Loading orders..."}
          </p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen celestial-gradient">
      {/* Navigation */}
              <nav className="flex items-center justify-between p-6">
                <Link href="/" className="flex items-center gap-2 text-[var(--primary)] hover:text-[var(--secondary)] transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
                <div className="text-center">
                  <h1 className="font-cormorant text-2xl font-bold text-[var(--primary)] flex items-center justify-center gap-2">
                    Admin Panel
                  </h1>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-[var(--primary)]">
                    <span className="font-cormorant text-lg font-bold">KahveYolu</span>
                    <AnimatedCoffeeCup size="small" />
                  </div>
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
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex gap-2 border-b border-[var(--border)]">
            <Button
              variant={activeTab === 'orders' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('orders')}
              className={activeTab === 'orders' ? 'btn-gold' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}
            >
              All Orders
            </Button>
            <Button
              variant={activeTab === 'queue' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('queue')}
              className={activeTab === 'queue' ? 'btn-gold' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}
            >
              Queue Management
            </Button>
          </div>
        </motion.div>

        {/* Queue Management Tab */}
        {activeTab === 'queue' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <QueueManagement onOrderUpdate={() => setRefreshTrigger(prev => prev + 1)} />
          </motion.div>
        )}


        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <>
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
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
              {orders.filter(o => o.orderStatus === "pending").length}
            </div>
            <div className="text-[var(--muted)]">Pending</div>
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

        {/* Orders Overview - No filtering needed as this is just an overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 flex justify-between items-center"
        >
          <div>
            <h2 className="font-cormorant text-2xl font-semibold text-[var(--foreground)]">
              All Orders Overview
            </h2>
            <p className="text-[var(--muted)]">
              View all orders and manage readings
            </p>
          </div>
          <Button
            onClick={() => setRefreshTrigger(prev => prev + 1)}
            variant="outline"
            disabled={refreshing}
            className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black"
          >
            {refreshing ? 'Refreshing...' : 'Refresh Orders'}
          </Button>
        </motion.div>

        {/* Orders List - Overview Only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          {refreshing && (
            <div className="p-3 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-lg flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--primary)]"></div>
              <span className="text-[var(--primary)] text-sm">Updating orders...</span>
            </div>
          )}
          
          {orders.map((order, index) => (
            <Card key={order.id} className="glass-card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-cormorant text-lg font-semibold text-[var(--foreground)]">
                      {order.fullName}
                    </h3>
                    <Badge className={`${getStatusColor(order.orderStatus)} text-white`}>
                      {order.orderStatus.replace("_", " ")}
                    </Badge>
                    {order.readingContent && (
                      <Badge className="bg-green-500 text-white">
                        Reading Ready
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-[var(--muted)]">
                    <div>
                      <p><strong>Age:</strong> {order.age}</p>
                      <p><strong>Gender:</strong> {order.gender}</p>
                      <p><strong>Status:</strong> {order.maritalStatus}</p>
                    </div>
                    <div>
                      <p><strong>Email:</strong> {order.email}</p>
                      <p><strong>Photos:</strong> {order.photos.length}</p>
                      <p><strong>Created:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {/* Photo Previews */}
                  {order.photos.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-[var(--muted)] mb-2">Coffee Cup Photos:</p>
                      <div className="flex gap-2">
                        {order.photos.map((photo, index) => (
                          <div key={index} className="w-16 h-16 rounded-lg overflow-hidden border border-[var(--border)]">
                            <img 
                              src={photo} 
                              alt={`Coffee cup ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewOrder(order)}
                    className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {orders.length === 0 && (
            <Card className="glass-card text-center py-12">
              <div className="text-[var(--muted)]">
                <Clock className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg">No orders found</p>
                <p className="text-sm">Orders will appear here when customers submit them</p>
              </div>
            </Card>
          )}
        </motion.div>
          </>
        )}
      </main>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
