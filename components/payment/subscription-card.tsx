'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { paymentApi } from '@/lib/api/payment';
import { Loader2, CheckCircle, CreditCard } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Make sure to replace with your public key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || 'pk_test_placeholder');

function CheckoutForm({ amount, onSuccess, onWait }: { amount: number, onSuccess: (id: string) => void, onWait: (loading: boolean) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    onWait(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      toast({ title: 'Payment Failed', description: error.message, variant: 'destructive' });
      setLoading(false);
      onWait(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      toast({ title: 'Payment Successful!' });
      onSuccess(paymentIntent.id);
      setLoading(false);
      onWait(false);
    } else {
        setLoading(false);
        onWait(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button disabled={!stripe || loading} className="w-full mt-4">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Pay ${amount}
      </Button>
    </form>
  );
}

export function SubscriptionCard({ title, price, description }: { title: string, price: number, description: string }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  const startCheckout = async () => {
    setInitializing(true);
    try {
      const res = await paymentApi.createInvoice(price, `Subscription: ${title}`);
      setClientSecret(res.data.clientSecret);
      setInvoiceId(res.data.invoice.id);
    } catch (err) {
      console.error(err);
    } finally {
      setInitializing(false);
    }
  };

  if (isPaid) {
    return (
      <Card className="border-green-500 bg-green-50 dark:bg-green-950/20">
        <CardContent className="pt-6 text-center text-green-700 dark:text-green-300">
          <CheckCircle className="h-12 w-12 mx-auto mb-2" />
          <h3 className="text-xl font-bold">Paid</h3>
          <p>Thank you for your subscription.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {title}
          <span className="text-2xl font-bold">${price}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {!clientSecret ? (
           <Button onClick={startCheckout} disabled={initializing} className="w-full">
             {initializing ? <Loader2 className="animate-spin" /> : 'Subscribe Now'}
           </Button>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
             <CheckoutForm 
               amount={price} 
               onSuccess={() => {
                 setIsPaid(true);
                 void invoiceId;
               }}
               onWait={() => {}} 
             />
          </Elements>
        )}
      </CardContent>
    </Card>
  );
}
