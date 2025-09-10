import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

type CartItem = { productId: number; quantity: number };

type Product = {
  id: number;
  name: string;
  price: number;
  original_price?: number;
  main_image?: string;
};

type EnrichedCartItem = CartItem & { product?: Product };

function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem('cartItems');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function clearCart() {
  localStorage.removeItem('cartItems');
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<EnrichedCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const items = getCart();
      // Fetch product details for each cart item
      const enriched: EnrichedCartItem[] = await Promise.all(
        items.map(async (ci) => {
          try {
            const { data } = await window.ezsite.apis.tablePage(39102, {
              PageNo: 1,
              PageSize: 1,
              Filters: [{ name: 'id', op: 'Equal', value: ci.productId }]
            });
            const product = data?.List?.[0] as Product | undefined;
            return { ...ci, product };
          } catch {
            return { ...ci };
          }
        })
      );
      setCart(enriched);
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0);
  }, [cart]);

  const shippingFee = shippingMethod === 'standard' ? 0 : 99;
  const total = subtotal + shippingFee;

  const canSubmit = useMemo(() => {
    if (cart.length === 0) return false;
    return (
      contactEmail.trim() &&
      firstName.trim() &&
      lastName.trim() &&
      address1.trim() &&
      city.trim() &&
      state.trim() &&
      postalCode.trim() &&
      country.trim()
    );
  }, [cart.length, contactEmail, firstName, lastName, address1, city, state, postalCode, country]);

  const continueToPayment = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      const draftOrder = {
        contact: { email: contactEmail, phone: contactPhone },
        shippingAddress: { firstName, lastName, address1, address2, city, state, postalCode, country },
        shippingMethod,
        items: cart.map((c) => ({ productId: c.productId, name: c.product?.name, price: c.product?.price, quantity: c.quantity })),
        amounts: { subtotal, shippingFee, total }
      };
      navigate('/payment', { state: { draftOrder } });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-4xl text-center">
        <Helmet>
          <title>Checkout | Bihari Delicacies</title>
        </Helmet>
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">Add some delicious products before checking out.</p>
        <Button onClick={() => navigate('/shops')}>Browse Shops</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Helmet>
        <title>Checkout | Bihari Delicacies</title>
      </Helmet>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact */}
          <section className="bg-white border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Contact information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+91 98xxxxxx" />
              </div>
            </div>
          </section>

          {/* Shipping */}
          <section className="bg-white border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address1">Address</Label>
                <Input id="address1" value={address1} onChange={(e) => setAddress1(e.target.value)} placeholder="House no., street" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address2">Apartment, suite, etc. (optional)</Label>
                <Input id="address2" value={address2} onChange={(e) => setAddress2(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" value={state} onChange={(e) => setState(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="postal">PIN code</Label>
                <Input id="postal" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="country">Country/region</Label>
                <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>
            </div>
          </section>

          {/* Delivery method */}
          <section className="bg-white border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Delivery method</h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between border rounded-lg p-4 cursor-pointer">
                <div className="flex items-center gap-3">
                  <input type="radio" name="shipping" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} />
                  <span>Standard (3-5 days)</span>
                </div>
                <span className="text-green-600 font-medium">Free</span>
              </label>
              <label className="flex items-center justify-between border rounded-lg p-4 cursor-pointer">
                <div className="flex items-center gap-3">
                  <input type="radio" name="shipping" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} />
                  <span>Express (1-2 days)</span>
                </div>
                <span className="font-medium">₹99</span>
              </label>
            </div>
          </section>

          {/* Continue to Payment */}
          <div className="flex justify-end">
            <Button disabled={!canSubmit || isSubmitting} onClick={continueToPayment} className="px-6">
              {isSubmitting ? 'Continuing...' : 'Continue to Payment'}
            </Button>
          </div>
        </div>

        {/* Right: Summary */}
        <aside className="bg-white border rounded-lg p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">Order summary</h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.productId} className="flex items-center gap-4">
                <img src={item.product?.main_image || '/placeholder.svg'} alt={item.product?.name || 'Product'} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-medium">{item.product?.name || 'Product'}</div>
                  <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                </div>
                <div className="font-medium">₹{(item.product?.price || 0) * item.quantity}</div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingMethod === 'standard' ? 'Free' : `₹${shippingFee}`}</span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;

