export interface ServiceGroup {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceProduct {
  id: string;
  name: string;
  description: string;
  groupId: string;
  price: number;
  setupFee?: number;
  billingCycle: 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'biennial';
  isActive: boolean;
  features: string[];
  stockControl: boolean;
  stockQuantity?: number;
  autoSetup: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceOrder {
  id: string;
  productId: string;
  clientId: string;
  status: 'pending' | 'active' | 'suspended' | 'cancelled';
  price: number;
  setupFee?: number;
  billingCycle: ServiceProduct['billingCycle'];
  nextDueDate: string;
  customFields?: Record<string, any>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceConfig {
  autoSetupEnabled: boolean;
  stockControlEnabled: boolean;
  defaultBillingCycle: ServiceProduct['billingCycle'];
  paymentGateways: string[];
  notificationSettings: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    webhookUrl?: string;
  };
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  createdAt: string;
}

export interface ClientService {
  clientId: string;
  totalActiveServices: number;
  totalSpent: number;
  lastOrderDate: string | null;
  nextDueDate: string | null;
  status: 'active' | 'inactive' | 'overdue';
  orders: ServiceOrder[];
}

export interface PaymentHistory {
  id: string;
  clientId: string;
  orderId: string;
  date: string;
  amount: number;
  type: 'setup' | 'recurring';
  productName: string;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod?: 'credit_card' | 'bank_transfer' | 'pix' | 'cash';
  paymentDate?: string;
  dueDate: string;
  invoiceNumber?: string;
  notes?: string;
}

export interface ClientFinancial {
  clientId: string;
  balance: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  lastPaymentDate?: string;
  nextDueDate?: string;
  paymentHistory: PaymentHistory[];
  pendingInvoices: PaymentHistory[];
}
