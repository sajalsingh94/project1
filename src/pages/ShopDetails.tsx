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
  shopName: z.string().min(2, 'Shop name is required'),
  address: z.string().min(5, 'Address is required'),
  category: z.string().min(2, 'Category is required')
});

type FormValues = z.infer<typeof schema>;

const ShopDetails: React.FC = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { shopName: '', address: '', category: '' }
  });
  const { toast } = useToast();

  const onSubmit = async (values: FormValues) => {
    try {
      form.clearErrors();
      form.setValue('shopName', values.shopName);
      const res = await fetch('/api/seller/shop-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(values)
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && (json?.success || json?.data)) {
        toast({ title: 'Success', description: 'Shop details saved successfully.' });
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
          <CardTitle>Shop Details</CardTitle>
          <CardDescription>Provide your shop information to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="shopName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Name</FormLabel>
                    <FormControl>
                      <Input placeholder="MarketX Store" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123, Main Street, City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Groceries" {...field} />
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

export default ShopDetails;

