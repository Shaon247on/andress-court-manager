'use client';

import React from 'react';
import Link from 'next/link';
import { User, CreditCard, Shield, Mail, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  return (
    <div className="h-full flex flex-col p-8 bg-white overflow-y-auto w-full">
      <div className="mb-8 shrink-0">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="max-w-4xl space-y-8 pb-10">
        
        {/* Profile Information */}
        <div className="border border-slate-200 rounded-2xl p-8 bg-white shadow-sm">
          <div className="flex items-center mb-6">
            <User className="w-5 h-5 text-emerald-500 mr-3" />
            <h2 className="text-lg font-bold text-slate-900">Profile Information</h2>
          </div>

          <div className="flex items-center space-x-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-white text-2xl font-bold">
              AU
            </div>
            <div>
              <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors mb-2">
                Change Photo
              </button>
              <p className="text-xs text-slate-400">JPG, PNG or GIF. Max size 2MB</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <Input defaultValue="Admin User" className="h-12" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <Input defaultValue="admin@athlongo.com" className="h-12 pl-12" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-slate-400" />
                </div>
                <Input defaultValue="+1 (555) 123-4567" className="h-12 pl-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border border-slate-200 rounded-2xl p-8 bg-white shadow-sm">
          <div className="flex items-center mb-6">
            <CreditCard className="w-5 h-5 text-emerald-500 mr-3" />
            <h2 className="text-lg font-bold text-slate-900">Payment Methods</h2>
          </div>

          <div className="flex justify-between items-center py-4 border-b border-slate-100">
             <div className="flex items-center">
                <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center mr-4">
                   <CreditCard className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                   <div className="text-sm font-medium text-slate-900">Visa ending in 4242</div>
                   <div className="text-xs text-slate-500">Expires 12/2026</div>
                </div>
             </div>
             <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">Default</span>
          </div>

          <div className="flex justify-between items-center py-6 border-b border-slate-100">
             <div>
                <div className="text-sm font-medium text-slate-900">Manage Payment Methods</div>
                <div className="text-xs text-slate-500">View all cards, set default, or remove payment methods</div>
             </div>
             <Link href="/dashboard/settings/payment-methods">
               <button className="px-5 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  Manage
               </button>
             </Link>
          </div>

          <div className="flex justify-between items-center pt-6">
             <div>
                <div className="text-sm font-medium text-slate-900">Add New Payment Method</div>
                <div className="text-xs text-slate-500">Add a bank card for withdrawals and payments</div>
             </div>
             <Button variant="primary" className="h-10 px-5 rounded-lg text-sm font-semibold">
                Add Card
             </Button>
          </div>
        </div>

        {/* Security */}
        <div className="border border-slate-200 rounded-2xl p-8 bg-white shadow-sm">
          <div className="flex items-center mb-6">
            <Shield className="w-5 h-5 text-emerald-500 mr-3" />
            <h2 className="text-lg font-bold text-slate-900">Security</h2>
          </div>

          <div className="flex justify-between items-center py-5 border border-slate-100 rounded-xl px-6 mb-4 bg-white shadow-sm">
             <div>
                <div className="text-sm font-medium text-slate-900">Schedule Maintenance</div>
                <div className="text-xs text-slate-500">Last changed 30 days ago</div>
             </div>
             <Link href="/dashboard/settings/schedule">
               <button className="px-5 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  Change Schedule
               </button>
             </Link>
          </div>

          <div className="flex justify-between items-center py-5 border border-slate-100 rounded-xl px-6 mb-4 bg-white shadow-sm">
             <div>
                <div className="text-sm font-medium text-slate-900">Password</div>
                <div className="text-xs text-slate-500">Last changed 30 days ago</div>
             </div>
             <Link href="/dashboard/settings/password">
               <button className="px-5 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  Change Password
               </button>
             </Link>
          </div>

          <div className="flex justify-between items-center py-5 border border-slate-100 rounded-xl px-6 bg-white shadow-sm">
             <div>
                <div className="text-sm font-medium text-slate-900">Cancellation Window (24 hrs)</div>
                <div className="text-xs text-slate-500">Cancel Policy</div>
             </div>
             <button className="px-5 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                Change Time
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
