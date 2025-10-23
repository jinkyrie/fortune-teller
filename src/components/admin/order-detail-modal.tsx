"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Download,
  Mail,
  Calendar,
  User,
  Coffee,
  CreditCard,
  Edit3,
  Save,
  Send,
  BookOpen,
  StickyNote
} from "lucide-react";

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

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailModal({ order, isOpen, onClose }: OrderDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isEditingReading, setIsEditingReading] = useState(false);
  const [readingContent, setReadingContent] = useState('');
  const [readingNotes, setReadingNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize reading content when order changes
  useEffect(() => {
    if (order) {
      setReadingContent(order.readingContent || '');
      setReadingNotes(order.readingNotes || '');
    }
  }, [order]);

  if (!order) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % order.photos.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + order.photos.length) % order.photos.length);
  };

  const handleSaveReading = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/orders/${order.id}/reading`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          readingContent,
          readingNotes,
          resendEmail: false
        }),
      });

      if (response.ok) {
        setIsEditingReading(false);
        // Update the order object with new content
        order.readingContent = readingContent;
        order.readingNotes = readingNotes;
        alert('Reading saved successfully!');
      } else {
        alert('Failed to save reading. Please try again.');
      }
    } catch (error) {
      console.error('Error saving reading:', error);
      alert('Error saving reading. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendReading = async () => {
    if (!readingContent.trim()) {
      alert('Please add reading content before sending.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/orders/${order.id}/reading`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          readingContent,
          readingNotes,
          resendEmail: true
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setIsEditingReading(false);
        // Update the order object with new content
        order.readingContent = readingContent;
        order.readingNotes = readingNotes;
        alert(result.emailSent ? 'Reading saved and sent to customer!' : 'Reading saved successfully!');
      } else {
        alert('Failed to save/send reading. Please try again.');
      }
    } catch (error) {
      console.error('Error saving/sending reading:', error);
      alert('Error saving/sending reading. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "in_progress": return "bg-blue-500";
      case "completed": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "failed": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] max-h-[90vh] overflow-y-auto bg-[#0B0C10] border-[var(--border)]">
        <DialogHeader>
          <DialogTitle className="font-cormorant text-2xl font-bold text-[var(--foreground)]">
            Order Details - {order.fullName}
          </DialogTitle>
        </DialogHeader>

        {/* Vertical Stack Layout - Cards stacked vertically */}
        <div className="space-y-4">
          {/* Order Status Card */}
          <Card className="glass-card p-5">
            <h3 className="font-cormorant text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <span className="text-xl">📋</span>
              Order Status
            </h3>
            <div className="flex items-center gap-3">
              <Badge className={`${getStatusColor(order.orderStatus)} text-white px-3 py-1`}>
                {order.orderStatus.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
          </Card>

          {/* Customer Information Card */}
          <Card className="glass-card p-5">
            <h3 className="font-cormorant text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Info
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)]">Name:</span>
                <span className="text-[var(--foreground)] font-medium">{order.fullName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)]">Age:</span>
                <span className="text-[var(--foreground)]">{order.age}y</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)]">Gender:</span>
                <span className="text-[var(--foreground)] capitalize">{order.gender}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)]">Status:</span>
                <span className="text-[var(--foreground)] capitalize">{order.maritalStatus}</span>
              </div>
            </div>
          </Card>

          {/* Payment Information Card */}
          <Card className="glass-card p-5">
            <h3 className="font-cormorant text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)]">Provider:</span>
                <span className="text-[var(--foreground)] capitalize">{order.paymentProvider || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)]">Amount:</span>
                <span className="text-[var(--foreground)] font-medium">
                  {order.paidAmount ? `${order.paidAmount} ${order.paymentCurrency || 'TRY'}` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)]">Status:</span>
                <Badge className={`${getPaymentStatusColor(order.paymentStatus)} text-white text-xs px-2 py-1`}>
                  {order.paymentStatus.toUpperCase()}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Order Timeline Card */}
          <Card className="glass-card p-5">
            <h3 className="font-cormorant text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Timeline
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)]">Created:</span>
                <span className="text-[var(--foreground)]">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              {order.completedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-[var(--muted)]">Completed:</span>
                  <span className="text-[var(--foreground)]">
                    {new Date(order.completedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)]">Email:</span>
                <span className="text-[var(--foreground)] text-xs truncate max-w-[140px]" title={order.email}>
                  {order.email}
                </span>
              </div>
            </div>
          </Card>

          {/* Coffee Cup Analysis Card */}
          <Card className="glass-card p-5">
            <h3 className="font-cormorant text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Coffee className="w-5 h-5" />
              Coffee Cup Analysis ({order.photos.length} photos)
            </h3>
              
              {order.photos.length > 0 ? (
                <div className="space-y-6">
                  {/* Main Image Display */}
                  <div className="relative">
                    <div className={`relative overflow-hidden rounded-lg border border-[var(--border)] ${
                      isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                    }`}>
                      <img
                        src={order.photos[currentImageIndex]}
                        alt={`Coffee cup analysis ${currentImageIndex + 1}`}
                        className={`w-full h-96 object-cover transition-transform duration-300 ${
                          isZoomed ? 'scale-150' : 'scale-100'
                        }`}
                        onClick={() => setIsZoomed(!isZoomed)}
                      />
                      
                      {/* Image Navigation */}
                      {order.photos.length > 1 && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Image Controls */}
                    <div className="flex items-center justify-center gap-3 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsZoomed(!isZoomed)}
                        className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black px-4 py-2"
                      >
                        {isZoomed ? <ZoomOut className="w-4 h-4 mr-2" /> : <ZoomIn className="w-4 h-4 mr-2" />}
                        {isZoomed ? 'Zoom Out' : 'Zoom In'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(order.photos[currentImageIndex], '_blank')}
                        className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black px-4 py-2"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>

                  {/* Thumbnail Navigation */}
                  {order.photos.length > 1 && (
                    <div className="grid grid-cols-4 lg:grid-cols-6 gap-3">
                      {order.photos.map((photo, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                            index === currentImageIndex
                              ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/20'
                              : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                          }`}
                        >
                          <img
                            src={photo}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-20 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Image Counter */}
                  <div className="text-center text-sm text-[var(--muted)] bg-[var(--background)]/50 rounded-lg py-2">
                    Image {currentImageIndex + 1} of {order.photos.length}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-[var(--muted)]">
                  <Coffee className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No photos available for this order</p>
                </div>
              )}
            </Card>

          {/* Reading Content Card */}
          <Card className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-cormorant text-lg font-semibold text-[var(--foreground)] flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Fortune Reading
              </h3>
              <div className="flex gap-2">
                {!isEditingReading ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingReading(true)}
                    className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingReading(false)}
                      className="border-[var(--border)] text-[var(--foreground)] hover:bg-gray-500 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSaveReading}
                      disabled={isSaving}
                      className="border-[var(--border)] text-[var(--foreground)] hover:bg-blue-500 hover:text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSendReading}
                      disabled={isSaving}
                      className="btn-gold"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isSaving ? 'Sending...' : 'Save & Send'}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {isEditingReading ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Reading Content (What the customer will see)
                  </label>
                  <textarea
                    value={readingContent}
                    onChange={(e) => setReadingContent(e.target.value)}
                    className="w-full h-40 p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    placeholder="Write the fortune reading content here..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Internal Notes (Only visible to you)
                  </label>
                  <textarea
                    value={readingNotes}
                    onChange={(e) => setReadingNotes(e.target.value)}
                    className="w-full h-24 p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    placeholder="Add internal notes about this reading..."
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {order.readingContent ? (
                  <div>
                    <h4 className="text-sm font-medium text-[var(--foreground)] mb-2">Reading Content:</h4>
                    <div className="bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-lg p-4">
                      <div className="whitespace-pre-wrap text-[var(--foreground)] leading-relaxed">
                        {order.readingContent}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-[var(--muted)]">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No reading content yet</p>
                    <p className="text-sm">Click "Edit" to add reading content</p>
                  </div>
                )}

                {order.readingNotes && (
                  <div>
                    <h4 className="text-sm font-medium text-[var(--foreground)] mb-2 flex items-center gap-2">
                      <StickyNote className="w-4 h-4" />
                      Internal Notes:
                    </h4>
                    <div className="bg-[var(--background)]/50 border border-[var(--border)] rounded-lg p-4">
                      <div className="whitespace-pre-wrap text-[var(--muted)] text-sm">
                        {order.readingNotes}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-[var(--border)] mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black px-6 py-2"
          >
            Close
          </Button>
          <Button
            onClick={() => window.open(`mailto:${order.email}`, '_blank')}
            className="btn-gold px-6 py-2"
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact Customer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
