"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Check } from "lucide-react";

interface PaymentSelectorProps {
  orderDraft: any;
  onPaymentSuccess: (paymentUrl: string) => void;
  onPaymentError: (error: string) => void;
}

export default function PaymentSelector({ orderDraft, onPaymentSuccess, onPaymentError }: PaymentSelectorProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'select' | 'processing' | 'queue-position'>('select');
  const [queuePosition, setQueuePosition] = useState<{position: number, estimatedWaitTime: number} | null>(null);

  const paymentProviders = [
    {
      id: 'iyzico',
      name: 'Iyzico',
      description: 'Secure payment with credit/debit cards',
      icon: '/pay_with_iyzico_colored.svg',
      features: ['All major cards', 'Secure SSL', 'Fast processing']
    },
    {
      id: 'paytr',
      name: 'PayTR',
      description: 'Fast and secure payment processing',
      icon: '/paytr.jpeg',
      features: ['Mobile payments', 'Bank transfers', 'Quick processing']
    }
  ];

  const handleProceed = async () => {
    setLoading(true);
    setStep('processing');

    try {
      // Create the order directly (skip payment for now)
      const orderResponse = await fetch('/api/test-create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDraft),
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.json();
        console.error('Order creation failed:', error);
        throw new Error(error.error || error.details || 'Failed to create order');
      }

      const createdOrder = await orderResponse.json();
      
      // Store queue position for display
      if (createdOrder.queuePosition) {
        setQueuePosition({
          position: createdOrder.queuePosition,
          estimatedWaitTime: createdOrder.estimatedWaitTime
        });
      }

      // Skip payment and go directly to success
      setStep('queue-position');
    } catch (error) {
      onPaymentError(error instanceof Error ? error.message : 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'processing') {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
        <h3 className="font-cormorant text-xl font-bold text-[var(--foreground)] mb-2">
          Creating Order...
        </h3>
        <p className="text-[var(--muted)]">
          Please wait while we process your order
        </p>
      </div>
    );
  }

  if (step === 'queue-position') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h3 className="font-cormorant text-3xl font-bold text-[var(--foreground)] mb-4">
          Order Created Successfully!
        </h3>
        <div className="bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-lg p-6 mb-6">
          <h4 className="font-cormorant text-xl font-bold text-[var(--primary)] mb-2">
            Your Reading is in Queue
          </h4>
          {queuePosition && (
            <div className="space-y-2">
              <p className="text-[var(--foreground)]">
                <strong>Queue Position:</strong> #{queuePosition.position}
              </p>
              <p className="text-[var(--foreground)]">
                <strong>Estimated Wait Time:</strong> {queuePosition.estimatedWaitTime} minutes
              </p>
            </div>
          )}
          <p className="text-[var(--muted)] mt-4">
            You will receive an email notification when your reading is ready.
          </p>
        </div>
        <Button
          onClick={() => window.location.href = '/dashboard'}
          className="btn-gold px-8 py-3 text-lg"
        >
          Go to Dashboard
        </Button>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-cormorant text-3xl font-bold text-[var(--foreground)] mb-2">
          Choose Payment Method
        </h2>
        <p className="text-[var(--muted)]">
          Select your preferred payment provider
        </p>
      </div>

      {/* Payment Disabled Notice */}
      <div className="text-center py-8">
        <div className="bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-lg p-6">
          <h3 className="font-cormorant text-xl font-bold text-[var(--primary)] mb-2">
            Payment Temporarily Disabled
          </h3>
          <p className="text-[var(--muted)]">
            Your order will be created directly without payment processing.
          </p>
        </div>
      </div>

      {/* Proceed Button */}
      <div className="text-center">
        <Button
          onClick={handleProceed}
          disabled={loading}
          className="btn-gold px-8 py-3 text-lg"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating Order...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Create Order
            </>
          )}
        </Button>
      </div>

      <div className="text-center">
        <p className="text-[var(--muted)] text-sm">
          <Shield className="w-4 h-4 inline mr-1" />
          All payments are processed securely with SSL encryption
        </p>
      </div>
    </div>
  );
}
