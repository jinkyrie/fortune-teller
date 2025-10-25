"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Check, CreditCard } from "lucide-react";

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
  const [mounted, setMounted] = useState(false);

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleProceed = async (paymentMethod?: string) => {
    setLoading(true);
    setStep('processing');

    try {
      // Create the order first
      const orderResponse = await fetch('/api/orders', {
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
      
      // Handle payment based on selected method
      if (paymentMethod === 'iyzico') {
        // Use new backend integration for Iyzico payment
        const paymentResponse = await fetch('http://localhost:3001/api/iyzico/create-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: createdOrder.totalAmount || '50.00',
            currency: 'TRY',
            email: createdOrder.email,
            basketId: createdOrder.orderId,
            items: [{
              id: createdOrder.orderId,
              name: 'Fortune Reading',
              price: createdOrder.totalAmount || '50.00'
            }]
          })
        });

        if (paymentResponse.ok) {
          const paymentData = await paymentResponse.json();
          if (paymentData.success) {
            // Redirect to Iyzico payment page
            window.location.href = paymentData.paymentUrl;
          } else {
            throw new Error(paymentData.error || 'Failed to create payment');
          }
        } else {
          const errorData = await paymentResponse.json();
          throw new Error(errorData.error || 'Failed to create payment');
        }
      } else if (paymentMethod === 'paytr') {
        // Handle PayTR payment (implement if needed)
        throw new Error('PayTR payment not implemented yet');
      } else {
        // Fallback: create order without payment (for testing)
        setQueuePosition({
          position: Math.floor(Math.random() * 10) + 1,
          estimatedWaitTime: Math.floor(Math.random() * 60) + 30
        });
        setStep('queue-position');
        onPaymentSuccess(createdOrder.orderId);
      }
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


  // Prevent hydration issues
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="font-cormorant text-3xl font-bold text-[var(--foreground)] mb-2">
            Choose Payment Method
          </h2>
          <p className="text-[var(--muted)]">
            Loading payment options...
          </p>
        </div>
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

      {/* Payment Methods */}
      <div className="grid gap-4">
        {paymentProviders.map((provider) => (
          <div
            key={provider.id}
            className={`border rounded-lg p-4 transition-colors cursor-pointer ${
              selectedProvider === provider.id
                ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                : 'border-[var(--border)] hover:border-[var(--primary)]'
            }`}
            onClick={() => setSelectedProvider(provider.id)}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                <img 
                  src={provider.icon} 
                  alt={provider.name}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--foreground)]">{provider.name}</h3>
                <p className="text-sm text-[var(--muted)]">{provider.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {provider.features.map((feature, index) => (
                    <span
                      key={index}
                      className="text-xs bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-1 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-[var(--primary)]">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Proceed Button */}
      {selectedProvider && (
        <div className="text-center">
          <Button
            onClick={() => handleProceed(selectedProvider)}
            disabled={loading}
            className="btn-gold px-8 py-3 text-lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Proceed with {paymentProviders.find(p => p.id === selectedProvider)?.name}
              </>
            )}
          </Button>
        </div>
      )}

      <div className="text-center">
        <p className="text-[var(--muted)] text-sm">
          <Shield className="w-4 h-4 inline mr-1" />
          All payments are processed securely with SSL encryption
        </p>
      </div>
    </div>
  );
}
