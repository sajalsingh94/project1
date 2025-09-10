import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation() as any;
  const navigate = useNavigate();
  const orderId = location.state?.orderId;
  const order = location.state?.order;

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <Helmet>
        <title>Order Confirmed | Bihari Delicacies</title>
      </Helmet>
      <div className="max-w-2xl mx-auto p-6 rounded-xl shadow-lg bg-white w-full text-center">
        <div className="text-4xl mb-2">✅</div>
        <h1 className="text-2xl font-semibold mb-2">Payment Successful</h1>
        <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
        <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
          <div className="mb-2"><span className="font-medium">Order ID:</span> {orderId || 'N/A'}</div>
          <div className="space-y-2">
            {order?.items?.map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{(item.price || 0) * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{order?.amounts?.total || 0}</span>
          </div>
        </div>
        <Button className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;

