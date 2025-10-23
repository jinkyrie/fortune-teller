"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Clock, Users, AlertCircle, CheckCircle, Play, Pause, X } from 'lucide-react';

interface QueueStats {
  totalInQueue: number;
  estimatedWaitTime: number;
  dailyLimit: number;
  dailyOrders: number;
  canAcceptNewOrders: boolean;
}

interface QueueOrder {
  id: string;
  fullName: string;
  email: string;
  orderStatus: string;
  queuePosition: number | null;
  estimatedWaitTime: number | null;
  createdAt: string;
  startedAt: string | null;
  photos: string;
  readingContent?: string;
  readingNotes?: string;
}

interface QueueData {
  stats: QueueStats;
  orders: QueueOrder[];
}

interface QueueManagementProps {
  onOrderUpdate?: () => void;
}

export default function QueueManagement({ onOrderUpdate }: QueueManagementProps) {
  const [queueData, setQueueData] = useState<QueueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<QueueOrder | null>(null);
  const [readingContent, setReadingContent] = useState('');
  const [readingNotes, setReadingNotes] = useState('');

  useEffect(() => {
    fetchQueueData();
  }, []);

  const fetchQueueData = async () => {
    try {
      const response = await fetch('/api/queue');
      if (response.ok) {
        const data = await response.json();
        setQueueData(data);
      }
    } catch (error) {
      console.error('Error fetching queue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processNextOrder = async () => {
    setProcessing(true);
    try {
      const response = await fetch('/api/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'process_next' })
      });

      if (response.ok) {
        await fetchQueueData();
        onOrderUpdate?.(); // Notify parent component
      }
    } catch (error) {
      console.error('Error processing next order:', error);
    } finally {
      setProcessing(false);
    }
  };

  const completeOrder = async () => {
    if (!selectedOrder || !readingContent.trim()) return;

    setProcessing(true);
    try {
      const response = await fetch('/api/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete',
          orderId: selectedOrder.id,
          readingContent: readingContent.trim(),
          readingNotes: readingNotes.trim()
        })
      });

      if (response.ok) {
        setSelectedOrder(null);
        setReadingContent('');
        setReadingNotes('');
        await fetchQueueData();
        onOrderUpdate?.(); // Notify parent component
      }
    } catch (error) {
      console.error('Error completing order:', error);
    } finally {
      setProcessing(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const response = await fetch('/api/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel',
          orderId
        })
      });

      if (response.ok) {
        await fetchQueueData();
        onOrderUpdate?.(); // Notify parent component
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'queued':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Queued</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-600 border-green-600">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-red-600 border-red-600">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (!queueData) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-500">Failed to load queue data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Queue Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card p-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[var(--primary)]" />
            <div>
              <p className="text-sm text-[var(--muted)]">Total in Queue</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">{queueData.stats.totalInQueue}</p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--primary)]" />
            <div>
              <p className="text-sm text-[var(--muted)]">Est. Wait Time</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">{queueData.stats.estimatedWaitTime}m</p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[var(--primary)]" />
            <div>
              <p className="text-sm text-[var(--muted)]">Today's Orders</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">{queueData.stats.dailyOrders}</p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[var(--primary)]" />
            <div>
              <p className="text-sm text-[var(--muted)]">Daily Limit</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">{queueData.stats.dailyLimit}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Queue Actions */}
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-[var(--foreground)]">Queue Management</h3>
          <div className="flex gap-2">
            <Button
              onClick={processNextOrder}
              disabled={processing || queueData.stats.totalInQueue === 0}
              className="btn-gold"
            >
              <Play className="w-4 h-4 mr-2" />
              Process Next Order
            </Button>
            <Button
              onClick={() => {
                fetchQueueData();
                onOrderUpdate?.(); // Also refresh orders
              }}
              variant="outline"
              className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black"
            >
              Refresh All
            </Button>
          </div>
        </div>

        {!queueData.stats.canAcceptNewOrders && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">Daily limit reached!</span>
            </div>
            <p className="text-red-300 text-sm mt-1">
              No new orders will be accepted until tomorrow.
            </p>
          </div>
        )}
      </Card>

      {/* Queue Orders */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">Queue Orders</h3>
        
        {queueData.orders.length === 0 ? (
          <Card className="glass-card p-8 text-center">
            <Users className="w-12 h-12 text-[var(--muted)] mx-auto mb-4" />
            <p className="text-[var(--muted)]">No orders in queue</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {queueData.orders.map((order) => (
              <Card key={order.id} className="glass-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-[var(--muted)]">Position</p>
                      <p className="text-xl font-bold text-[var(--primary)]">
                        {order.queuePosition || 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-[var(--foreground)]">{order.fullName}</h4>
                      <p className="text-sm text-[var(--muted)]">{order.email}</p>
                      <p className="text-xs text-[var(--muted)]">
                        Created: {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(order.orderStatus)}
                      {order.estimatedWaitTime && (
                        <span className="text-sm text-[var(--muted)]">
                          ~{order.estimatedWaitTime}m wait
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.orderStatus === 'in_progress' && (
                      <Button
                        onClick={() => setSelectedOrder(order)}
                        variant="outline"
                        size="sm"
                        className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black"
                      >
                        Complete Reading
                      </Button>
                    )}
                    
                    {order.orderStatus === 'queued' && (
                      <Button
                        onClick={() => cancelOrder(order.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Reading Completion Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="glass-card p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-[var(--foreground)]">
                Complete Reading for {selectedOrder.fullName}
              </h3>
              <Button
                onClick={() => setSelectedOrder(null)}
                variant="outline"
                size="sm"
                className="border-[var(--border)] text-[var(--foreground)]"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Reading Content *
                </label>
                <Textarea
                  value={readingContent}
                  onChange={(e) => setReadingContent(e.target.value)}
                  placeholder="Enter the fortune reading content here..."
                  className="min-h-[200px] border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Internal Notes (Optional)
                </label>
                <Textarea
                  value={readingNotes}
                  onChange={(e) => setReadingNotes(e.target.value)}
                  placeholder="Add any internal notes about this reading..."
                  className="min-h-[100px] border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => setSelectedOrder(null)}
                  variant="outline"
                  className="border-[var(--border)] text-[var(--foreground)]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={completeOrder}
                  disabled={processing || !readingContent.trim()}
                  className="btn-gold"
                >
                  {processing ? 'Completing...' : 'Complete Reading'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
