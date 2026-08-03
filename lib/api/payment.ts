import { apiClient } from './client';

export interface Invoice {
  id: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
}

export interface InvoiceCheckoutResponse {
  invoice: Invoice;
  clientSecret: string | null;
  paymentIntentId: string;
}

export const paymentApi = {
  createIntent: (amount: number, currency = 'usd') => 
    apiClient.post<{ clientSecret: string; id: string }>('/payments/create-intent', { amount, currency }),
  
  createInvoice: (amount: number, description: string) =>
    apiClient.post<InvoiceCheckoutResponse>('/payments/invoices', { amount, description }),
    
  getHistory: () => 
    apiClient.get<Invoice[]>('/payments/history'),
};
