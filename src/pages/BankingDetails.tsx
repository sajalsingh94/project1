import React, { useState } from 'react';
import { api } from '../lib/api';

const BankingDetails: React.FC = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [bankName, setBankName] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/seller/banking-details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify({ accountNumber, ifsc, bankName })
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok && (json?.success || json?.data)) {
      alert('Banking details saved successfully');
    } else {
      alert(json?.message || 'Failed to save');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Banking Details</h2>
      <input
        type="text"
        placeholder="Account Number"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
        className="border p-2 w-full"
      />
      <input
        type="text"
        placeholder="IFSC Code"
        value={ifsc}
        onChange={(e) => setIfsc(e.target.value)}
        className="border p-2 w-full"
      />
      <input
        type="text"
        placeholder="Bank Name"
        value={bankName}
        onChange={(e) => setBankName(e.target.value)}
        className="border p-2 w-full"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
    </form>
  );
};

export default BankingDetails;

