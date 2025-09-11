import React, { useState } from 'react';
import axios from '../lib/api';

const BankingDetails: React.FC = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [bankName, setBankName] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await axios.post('/api/seller/banking-details', { accountNumber, ifsc, bankName });
    if ((res as any)?.data?.success) {
      alert('Banking details saved successfully');
    } else {
      alert((res as any)?.data?.message || 'Failed to save');
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

