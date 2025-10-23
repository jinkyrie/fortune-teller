export interface Order {
  id: string;
  fullName: string;
  age: number;
  maritalStatus: string;
  gender: string;
  email: string;
  photos: string[];
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
  completedAt?: Date;
}

export interface CreateOrderRequest {
  fullName: string;
  age: number;
  maritalStatus: string;
  gender: string;
  email: string;
  photos: string[];
  paymentStatus?: string;
}

export interface PaymentData {
  orderId: string;
  amount: number;
  currency: string;
  paymentUrl: string;
}

export interface NotificationRequest {
  orderId: string;
  email: string;
  type: 'confirmation' | 'completion';
}

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
    };
  }
}

