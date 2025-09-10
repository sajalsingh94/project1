import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

const SellerBankingPage: React.FC = () => {
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [bankName, setBankName] = useState('');
  const [branch, setBranch] = useState('');
  const [taxId, setTaxId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await api.sellerBanking.get();
      const rec: any = data as any;
      if (rec) {
        setAccountHolderName(rec.accountHolderName || '');
        setBankAccountNumber(rec.bankAccountNumber || '');
        setIfsc(rec.ifsc || '');
        setBankName(rec.bankName || '');
        setBranch(rec.branch || '');
        setTaxId(rec.taxId || '');
      }
    })();
  }, []);

  const isValid = accountHolderName.trim() && /^\d{6,18}$/.test(bankAccountNumber) && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase()) && bankName.trim();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setIsSubmitting(true);
    try {
      const { error } = await api.sellerBanking.save({ accountHolderName, bankAccountNumber, ifsc, bankName, branch, taxId });
      if (!error) {
        alert('Your banking details have been saved. You can now receive payments for your sales.');
        navigate('/seller/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <Helmet>
        <title>Seller Banking Details | Bihari Delicacies</title>
      </Helmet>
      <div className="max-w-2xl mx-auto p-6 rounded-xl shadow-lg bg-white w-full">
        <h1 className="text-2xl font-semibold mb-6 text-center">Banking Details</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="holder">Account holder name</Label>
            <Input id="holder" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <Label htmlFor="acc">Bank account number</Label>
            <Input id="acc" value={bankAccountNumber} onChange={(e) => setBankAccountNumber(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="ifsc">IFSC code</Label>
            <Input id="ifsc" value={ifsc} onChange={(e) => setIfsc(e.target.value.toUpperCase())} placeholder="SBIN0000001" />
          </div>
          <div>
            <Label htmlFor="bank">Bank name</Label>
            <Input id="bank" value={bankName} onChange={(e) => setBankName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="branch">Branch</Label>
            <Input id="branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="gst">GSTIN / Tax ID (optional)</Label>
            <Input id="gst" value={taxId} onChange={(e) => setTaxId(e.target.value)} />
          </div>
          <Button type="submit" className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700" disabled={!isValid || isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Banking Details'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SellerBankingPage;

