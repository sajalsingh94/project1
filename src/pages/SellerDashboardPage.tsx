import React, { useState } from 'react';
import { api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';

const SellerDashboardPage: React.FC = () => {
  const [seller, setSeller] = useState({
    business_name: '',
    owner_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    description: ''
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    weight: '',
    ingredients: ''
  });
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productImageUrl, setProductImageUrl] = useState<string>('');

  const createSeller = useMutation({
    mutationFn: async () => {
      return api.sellers.create({
        ...seller,
        profile_image: profileImage || undefined,
        banner_image: bannerImage || undefined
      });
    }
  });

  const uploadProductImage = useMutation({
    mutationFn: async () => {
      if (!productImage) return { error: 'No image' } as any;
      return api.upload.image(productImage);
    },
    onSuccess: (res: any) => {
      if (res?.data?.url) setProductImageUrl(res.data.url);
    }
  });

  const onSubmitSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    await createSeller.mutateAsync();
  };

  const onSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (productImage && !productImageUrl) {
      const { error } = await uploadProductImage.mutateAsync() as any;
      if (error) return;
    }
    alert('Product saved locally. Hook to API as needed.');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Seller Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={onSubmitSeller} className="space-y-3">
          <h2 className="text-xl font-semibold">Seller Details</h2>
          <input className="border p-2 w-full" placeholder="Business name" value={seller.business_name} onChange={e=>setSeller(s=>({...s,business_name:e.target.value}))} />
          <input className="border p-2 w-full" placeholder="Owner name" value={seller.owner_name} onChange={e=>setSeller(s=>({...s,owner_name:e.target.value}))} />
          <input className="border p-2 w-full" placeholder="Email" value={seller.email} onChange={e=>setSeller(s=>({...s,email:e.target.value}))} />
          <input className="border p-2 w-full" placeholder="Phone" value={seller.phone} onChange={e=>setSeller(s=>({...s,phone:e.target.value}))} />
          <input className="border p-2 w-full" placeholder="Address" value={seller.address} onChange={e=>setSeller(s=>({...s,address:e.target.value}))} />
          <div className="grid grid-cols-2 gap-2">
            <input className="border p-2 w-full" placeholder="City" value={seller.city} onChange={e=>setSeller(s=>({...s,city:e.target.value}))} />
            <input className="border p-2 w-full" placeholder="State" value={seller.state} onChange={e=>setSeller(s=>({...s,state:e.target.value}))} />
          </div>
          <textarea className="border p-2 w-full" placeholder="Description" value={seller.description} onChange={e=>setSeller(s=>({...s,description:e.target.value}))} />
          <div className="grid grid-cols-2 gap-2">
            <input type="file" accept="image/*" onChange={e=>setProfileImage(e.target.files?.[0] || null)} />
            <input type="file" accept="image/*" onChange={e=>setBannerImage(e.target.files?.[0] || null)} />
          </div>
          <button className="bg-black text-white px-4 py-2" type="submit" disabled={createSeller.isPending}>
            {createSeller.isPending ? 'Saving...' : 'Save Seller'}
          </button>
          {createSeller.data?.error && <p className="text-red-600">{String(createSeller.data.error)}</p>}
        </form>

        <form onSubmit={onSubmitProduct} className="space-y-3">
          <h2 className="text-xl font-semibold">Product Details</h2>
          <input className="border p-2 w-full" placeholder="Name" value={product.name} onChange={e=>setProduct(s=>({...s,name:e.target.value}))} />
          <textarea className="border p-2 w-full" placeholder="Description" value={product.description} onChange={e=>setProduct(s=>({...s,description:e.target.value}))} />
          <div className="grid grid-cols-2 gap-2">
            <input className="border p-2 w-full" placeholder="Price" value={product.price} onChange={e=>setProduct(s=>({...s,price:e.target.value}))} />
            <input className="border p-2 w-full" placeholder="Weight" value={product.weight} onChange={e=>setProduct(s=>({...s,weight:e.target.value}))} />
          </div>
          <textarea className="border p-2 w-full" placeholder="Ingredients" value={product.ingredients} onChange={e=>setProduct(s=>({...s,ingredients:e.target.value}))} />
          <input type="file" accept="image/*" onChange={e=>setProductImage(e.target.files?.[0] || null)} />
          <div className="flex items-center gap-2">
            <button className="bg-gray-800 text-white px-3 py-1" type="button" onClick={()=>uploadProductImage.mutate()} disabled={uploadProductImage.isPending || !productImage}>
              {uploadProductImage.isPending ? 'Uploading...' : 'Upload Image'}
            </button>
            {productImageUrl && <span className="text-sm">Uploaded: {productImageUrl}</span>}
          </div>
          <button className="bg-black text-white px-4 py-2" type="submit">Save Product</button>
        </form>
      </div>
    </div>
  );
};

export default SellerDashboardPage;

