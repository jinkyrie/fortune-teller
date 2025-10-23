"use client";

import { useState, useEffect } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Upload, X, User, CreditCard } from "lucide-react";
import PaymentSelector from "./payment-selector";
import AnimatedCoffeeCup from "./animated-coffee-cup";

export default function OrderForm() {
  const { user, isLoaded } = useUser();
  
  // Check if we're in build mode (no Clerk available)
  const isBuildMode = typeof window === 'undefined' || !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === 'pk_test_...';
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    maritalStatus: "",
    gender: "",
    email: "",
    photos: [] as File[],
  });

  // Build-time fallback
  if (isBuildMode) {
    return (
      <div className="min-h-screen celestial-gradient flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--primary)] mb-4">Order Form</h1>
          <p className="text-[var(--muted)]">Authentication required</p>
        </div>
      </div>
    );
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState<string[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
      }));
    }
  }, [user]);


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setUploadingPhotos(true);
      
      try {
        const uploadPromises = files.map(async (file) => {
          // Validate file size (max 5MB)
          if (file.size > 5 * 1024 * 1024) {
            throw new Error(`File ${file.name} is too large. Maximum size is 5MB.`);
          }
          
          // Validate file type
          if (!file.type.startsWith('image/')) {
            throw new Error(`File ${file.name} is not an image.`);
          }
          
          const formData = new FormData();
          formData.append('file', file);
          
          let response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          // If Cloudinary fails, try test endpoint
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
            if (errorData.error && errorData.error.includes('Cloudinary')) {
              console.log('Cloudinary not configured, using test mode...');
              response = await fetch('/api/upload/test', {
                method: 'POST',
                body: formData,
              });
            }
          }
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
            throw new Error(errorData.error || `Upload failed with status ${response.status}`);
          }
          
          const result = await response.json();
          if (!result.url) {
            throw new Error('No URL returned from upload');
          }
          
          return result.url;
        });
        
        const urls = await Promise.all(uploadPromises);
        setUploadedPhotoUrls(prev => [...prev, ...urls].slice(0, 3));
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, ...files].slice(0, 3)
        }));
        
        // Clear the input
        event.target.value = '';
      } catch (error) {
        console.error('Error uploading photos:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to upload photos. Please try again.';
        alert(errorMessage);
      } finally {
        setUploadingPhotos(false);
      }
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    setUploadedPhotoUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create order draft (not saved to database yet)
      const orderDraft = {
        fullName: formData.fullName,
        age: parseInt(formData.age),
        maritalStatus: formData.maritalStatus,
        gender: formData.gender,
        email: formData.email,
        photos: uploadedPhotoUrls,
        paymentStatus: 'pending'
      };

      // Store order draft in component state for payment processing
      setCreatedOrder(orderDraft);
      setShowPayment(true);
    } catch (error) {
      console.error('Error preparing order:', error);
      alert(error instanceof Error ? error.message : 'Failed to prepare order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = (paymentUrl: string) => {
    // Redirect to payment page
    window.location.href = paymentUrl;
  };

  const handlePaymentError = (error: string) => {
    alert(`Payment Error: ${error}`);
  };

  // Show loading while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen celestial-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen celestial-gradient">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <Link href="/" className="flex items-center gap-2 text-[var(--primary)] hover:text-[var(--secondary)] transition-colors">
          ← Back to Home
        </Link>
        {user ? (
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-[var(--primary)] hover:text-[var(--secondary)] transition-colors">
              <User className="w-4 h-4" />
              Dashboard
            </Link>
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
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up" className="btn-gold">
              Sign Up
            </Link>
          </div>
        )}
      </nav>

      <main className="max-w-2xl mx-auto px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center mb-6"
          >
            <AnimatedCoffeeCup size="medium" />
            <h1 className="font-cormorant text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4 mt-4">
              Your Story Awaits in the Coffee
            </h1>
            
          </motion.div>
          <p className="text-[var(--muted)] text-lg">
            Share your details and coffee cup photos to unlock ancient wisdom
          </p>
        </motion.div>

        <Card className="glass-card">
          {!showPayment ? (
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-cormorant text-xl font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
                <span className="text-2xl">👤</span>
                Personal Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="fullName" className="text-[var(--foreground)]">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="bg-transparent border-[var(--border)] text-[var(--foreground)]"
                    required
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="age" className="text-[var(--foreground)]">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className="bg-transparent border-[var(--border)] text-[var(--foreground)]"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="maritalStatus" className="text-[var(--foreground)]">Marital Status</Label>
                  <Select value={formData.maritalStatus} onValueChange={(value) => handleInputChange("maritalStatus", value)}>
                    <SelectTrigger className="bg-transparent border-[var(--border)] text-[var(--foreground)]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0B0C10] border-[var(--border)] backdrop-blur-lg">
                      <SelectItem value="single" className="text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black">Single</SelectItem>
                      <SelectItem value="married" className="text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black">Married</SelectItem>
                      <SelectItem value="divorced" className="text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black">Divorced</SelectItem>
                      <SelectItem value="widowed" className="text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="gender" className="text-[var(--foreground)]">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger className="bg-transparent border-[var(--border)] text-[var(--foreground)]">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0B0C10] border-[var(--border)] backdrop-blur-lg">
                      <SelectItem value="male" className="text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black">Male</SelectItem>
                      <SelectItem value="female" className="text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black">Female</SelectItem>
                      <SelectItem value="other" className="text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-[var(--foreground)]">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-transparent border-[var(--border)] text-[var(--foreground)]"
                  required
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div className="space-y-4">
              <h3 className="font-cormorant text-xl font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
                <span className="text-2xl">📸</span>
                Upload Your Coffee Cup Photos
              </h3>
              
              {/* Photo Upload Guide */}
              <div className="bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)] rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="text-[var(--primary)] text-lg">☕</div>
                  <div className="space-y-2">
                    <h4 className="font-cormorant text-lg font-semibold text-[var(--foreground)]">
                      Photo Guidelines for Best Results
                    </h4>
                    <ul className="text-sm text-[var(--muted)] space-y-1">
                      <li className="flex items-center gap-2">
                        <span className="text-[var(--primary)]">•</span>
                        Upload 3 clear photos of your coffee cup and saucer
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[var(--primary)]">•</span>
                        Capture from top to bottom for complete pattern analysis
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[var(--primary)]">•</span>
                        Ensure good lighting and clear visibility.
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[var(--primary)]">•</span>
                        Include the saucer in your photos.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center hover:border-[var(--primary)] transition-colors duration-300">
                <Upload className="w-12 h-12 mx-auto mb-4 text-[var(--primary)]" />
                <p className="text-[var(--muted)] mb-4">
                  Upload up to 3 photos of your coffee cup for mystical analysis
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                  disabled={uploadingPhotos}
                />
                <label
                  htmlFor="photo-upload"
                  className={`btn-gold cursor-pointer inline-block ${uploadingPhotos ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {uploadingPhotos ? 'Uploading...' : 'Choose Photos'}
                </label>
              </div>

              {/* Photo Preview */}
              {uploadedPhotoUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {uploadedPhotoUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                className="w-full btn-gold text-lg py-4"
                disabled={isSubmitting || uploadedPhotoUrls.length === 0}
              >
                {isSubmitting ? "Preparing..." : "Proceed to Payment"}
              </Button>
            </div>
          </form>
          ) : (
            <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="font-cormorant text-2xl font-bold text-[var(--foreground)] mb-2">
                  Your Order is Almost Complete!
                </h2>
                <p className="text-[var(--muted)]">
                  Complete your payment to finalize your mystical reading order
                </p>
              </div>
              
              <PaymentSelector
                orderDraft={createdOrder}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
              
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowPayment(false)}
                  className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-black"
                >
                  Back to Form
                </Button>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

