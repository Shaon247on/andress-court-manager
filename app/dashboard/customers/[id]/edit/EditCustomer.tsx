// app/dashboard/customers/[id]/edit/EditCustomer.tsx

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, UserPlus, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { editCustomerAction } from '@/actions/customer.action';
import type { Customer } from '@/types/Customer.type';
import { toast } from 'sonner';

interface EditCustomerProps {
  customer: Customer;
}

export default function EditCustomer({ customer }: EditCustomerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: customer.full_name || '',
    email: customer.email || '',
    phone: customer.phone || '',
    country: customer.country || '',
    username: customer.username || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await editCustomerAction(customer.id, formData);
    
    if (res.success) {
      toast.success(res.data.message);
      router.push(`/dashboard/customers/${customer.id}`);
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl w-full mx-auto mt-5">
      <Link 
        href={`/dashboard/customers/${customer.id}`}
        className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Customer
      </Link>
      
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center">
          <UserPlus className="w-7 h-7 sm:w-8 sm:h-8 mr-3 text-primary" /> 
          Edit Customer
        </h1>
        <p className="text-slate-500 mt-2">Update the customer&lsquo;s information below.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-sm font-semibold text-slate-700">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              required
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. john@example.com"
              required
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">
              Phone Number
            </Label>
            <Input 
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +1234567890"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country" className="text-sm font-semibold text-slate-700">
              Country
            </Label>
            <Input 
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="e.g. USA"
              className="h-10"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="username" className="text-sm font-semibold text-slate-700">
              Username
            </Label>
            <Input 
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g. john_doe"
              className="h-10"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => router.push(`/dashboard/customers/${customer.id}`)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}