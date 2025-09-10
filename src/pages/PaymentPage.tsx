import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';

const PaymentPage: React.FC = () => {
  const location = useLocation() as any;
  const navigate = useNavigate();
  const draftOrder = location.state?.draftOrder;

  const [method, setMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  const total = useMemo(() => draftOrder?.amounts?.total || 0, [draftOrder]);

  if (!draftOrder) {
    navigate('/checkout', { replace: true });
    return null;
  }

  const canPay = useMemo(() => {
    if (method === 'card') {
      return cardNumber.replace(/\s+/g, '').length >= 12 && /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry) && cvv.length >= 3 && cardName.trim().length > 0;
    }
    return true;
  }, [method, cardNumber, expiry, cvv, cardName]);

  const handlePay = async () => {
    if (!canPay) return;
    setIsPaying(true);
    try {
      // Simulate payment
      const { error: payError } = await api.payments.simulate({ method, total, meta: { orderPreview: draftOrder } });
      if (payError) throw new Error(payError);

      // Create order
      const { data: orderRes, error } = await api.orders.create(draftOrder);
      if (error) throw new Error(error);

      // Clear cart and go to confirmation
      localStorage.removeItem('cartItems');
      const orderId = (orderRes as any)?.id;
      navigate('/order-confirmation', { replace: true, state: { orderId, order: draftOrder } });
    } catch (e) {
      console.error('Payment error', e);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Helmet>
        <title>Payment | Bihari Delicacies</title>
      </Helmet>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Payment form */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Select payment method</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="radio" name="pm" checked={method === 'card'} onChange={() => setMethod('card')} />
                <span>Credit/Debit Card</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="radio" name="pm" checked={method === 'upi'} onChange={() => setMethod('upi')} />
                <span>UPI</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="radio" name="pm" checked={method === 'netbanking'} onChange={() => setMethod('netbanking')} />
                <span>Net Banking</span>
              </label>
            </div>
          </section>

          {method === 'card' && (
            <section className="bg-white border rounded-lg p-6">
              <h3 className="font-medium mb-4">Card details</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="4111 1111 1111 1111" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                    <Input id="expiry" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="12/27" />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="123" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input id="cardName" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="John Doe" />
                </div>
              </div>
            </section>
          )}

          <Button className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700" disabled={!canPay || isPaying} onClick={handlePay}>
            {isPaying ? 'Processing...' : `Pay ₹${total}`}
          </Button>
        </div>

        {/* Right: Order summary */}
        <aside className="bg-white border rounded-lg p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">Order summary</h2>
          <div className="space-y-4">
            {draftOrder.items?.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                </div>
                <div className="font-medium">₹{(item.price || 0) * item.quantity}</div>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{draftOrder.amounts?.subtotal || 0}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{draftOrder.shippingMethod === 'standard' ? 'Free' : `₹${draftOrder.amounts?.shippingFee || 0}`}</span></div>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between text-base font-semibold"><span>Total</span><span>₹{total}</span></div>
        </aside>
      </div>
    </div>
  );
};

export default PaymentPage;

