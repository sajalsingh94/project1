import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const schema = z.object({
  accountNumber: z.string().min(9, 'Enter a valid account number').max(18, 'Too long'),
  ifsc: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/i, 'Invalid IFSC code'),
  bankName: z.string().min(2, 'Bank name is required')
});

type FormValues = z.infer<typeof schema>;

const BankingDetails: React.FC = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { accountNumber: '', ifsc: '', bankName: '' }
  });
  const { toast } = useToast();

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch('/api/seller/banking-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(values)
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && (json?.success || json?.data)) {
        toast({ title: 'Success', description: 'Banking details saved successfully.' });
      } else {
        toast({ title: 'Error', description: json?.message || 'Failed to save', variant: 'destructive' });
      }
    } catch (e) {
      toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' });
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Banking Details</CardTitle>
          <CardDescription>Provide bank details to receive payouts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input placeholder="000000000000" inputMode="numeric" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ifsc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IFSC</FormLabel>
                    <FormControl>
                      <Input placeholder="HDFC0001234" className="uppercase" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input placeholder="HDFC Bank" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting} className="rounded-xl bg-blue-600 hover:bg-blue-700">
                {form.formState.isSubmitting ? <LoadingSpinner label="Saving..." size={20} /> : 'Save'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankingDetails;

