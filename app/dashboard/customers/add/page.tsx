'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AddCustomerPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate saving the customer
    console.log('Customer to add:', formData);
    router.push('/dashboard/customers');
  };

  return (
    <div className="h-full flex flex-col p-8 bg-white overflow-y-auto">
      <div className="max-w-2xl w-full">
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Customers
        </button>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center">
            <UserPlus className="w-8 h-8 mr-3 text-primary" /> Add New Customer
          </h1>
          <p className="text-slate-500 mt-2">Enter the details to register a new customer in the system.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <Input 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                required
                className="h-10"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <Input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. john@example.com"
                required
                className="h-10"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
              <Input 
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +1234567890"
                required
                className="h-10"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Country</label>
              <Input 
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g. USA"
                required
                className="h-10"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => router.push('/dashboard/customers')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Customer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}