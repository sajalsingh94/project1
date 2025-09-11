import React, { useState } from 'react';
import axios from 'axios';

const ShopDetails: React.FC = () => {
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await axios.post('/seller/shop-details', { shopName, address, category }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('Shop details saved successfully');
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Shop Details</h2>
      <input
        type="text"
        placeholder="Shop Name"
        value={shopName}
        onChange={(e) => setShopName(e.target.value)}
        className="border p-2 w-full"
      />
      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="border p-2 w-full"
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 w-full"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
    </form>
  );
};

export default ShopDetails;

