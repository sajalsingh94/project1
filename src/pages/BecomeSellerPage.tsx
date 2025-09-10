import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';

const BecomeSellerPage: React.FC = () => {
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [description, setDescription] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const isValid = businessName.trim().length > 0 && ownerName.trim().length > 0;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setIsSubmitting(true);
    try {
      const payload: any = {
        business_name: businessName,
        owner_name: ownerName,
        email,
        phone,
        address,
        city,
        state,
        description
      };
      if (profileImage) payload.profile_image = profileImage;
      if (bannerImage) payload.banner_image = bannerImage;
      const { error } = await api.sellers.create(payload) as any;
      if (!error) {
        navigate('/seller/banking');
      } else {
        // eslint-disable-next-line no-console
        console.error('Create seller failed', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Become a Seller</CardTitle>
          <CardDescription>Tell us about your shop and upload images.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="business_name">Business Name</Label>
                <Input id="business_name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Mithaiwala Sweets" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner_name">Owner Name</Label>
                <Input id="owner_name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Ram Prasad Gupta" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="owner@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, City, State" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Patna" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" value={state} onChange={(e) => setState(e.target.value)} placeholder="Bihar" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Family business serving authentic sweets since 1950" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile_image">Profile Image</Label>
                <Input id="profile_image" type="file" accept="image/*" onChange={(e) => setProfileImage(e.target.files?.[0] || null)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="banner_image">Banner Image</Label>
                <Input id="banner_image" type="file" accept="image/*" onChange={(e) => setBannerImage(e.target.files?.[0] || null)} />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={!isValid || isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BecomeSellerPage;

