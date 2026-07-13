// app/dashboard/settings/payment-methods/PaymentMethodsList.tsx

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, MoreVertical, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setDefaultPayoutMethodAction, removePayoutMethodAction, addPayoutMethodAction } from '@/actions/payout-method.action';
import type { PayoutMethod } from '@/types/PayoutMethod.type';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PaymentMethodsListProps {
  methods: PayoutMethod[];
  errorMessage?: string;
}

export default function PaymentMethodsList({ methods, errorMessage }: PaymentMethodsListProps) {
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PayoutMethod | null>(null);

  // Add form state
  const [accountType, setAccountType] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  if (errorMessage) {
    return (
      <div className="h-full flex flex-col p-8 bg-white overflow-y-auto w-full">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      </div>
    );
  }

  const handleSetDefault = async (methodId: string) => {
    setLoading(true);
    const res = await setDefaultPayoutMethodAction(methodId);
    if (res.success) {
      toast.success(res.data.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setLoading(false);
    setActiveDropdown(null);
  };

  const handleRemove = async (method: PayoutMethod) => {
    setSelectedMethod(method);
    setDeleteDialogOpen(true);
    setActiveDropdown(null);
  };

  const confirmRemove = async () => {
    if (!selectedMethod) return;
    setLoading(true);
    const res = await removePayoutMethodAction(selectedMethod.id);
    if (res.success) {
      toast.success(res.data.message);
      setDeleteDialogOpen(false);
      setSelectedMethod(null);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!accountType.trim() || !accountNumber.trim() || !accountHolder.trim()) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    const res = await addPayoutMethodAction({
      account_type: accountType,
      account_number: accountNumber,
      account_holder: accountHolder,
    });
    if (res.success) {
      toast.success(res.data.message);
      setAddDialogOpen(false);
      setAccountType('');
      setAccountNumber('');
      setAccountHolder('');
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  // Mask account number for display
  const maskAccountNumber = (number: string) => {
    if (number.length <= 4) return '•••• •••• •••• ' + number;
    const lastFour = number.slice(-4);
    return '•••• •••• •••• ' + lastFour;
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 bg-white overflow-y-auto w-full">
      <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="flex items-center">
          <Link href="/dashboard/settings" className="p-2 border border-slate-200 bg-white mr-4 rounded-lg hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Payment Methods</h1>
            <p className="text-slate-500 mt-1">Manage your saved payment methods</p>
          </div>
        </div>
        <Button 
          variant="primary" 
          className="h-10 px-5 rounded-lg text-sm font-semibold shadow-sm w-full sm:w-auto"
          onClick={() => setAddDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Card
        </Button>
      </div>

      <div className="max-w-4xl space-y-6 pb-10 w-full">
        {methods.length === 0 ? (
          <div className="border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
            No payment methods added yet. Click &ldquo;Add Card&ldquo; to get started.
          </div>
        ) : (
          methods.map((method) => (
            <div 
              key={method.id} 
              className={cn(
                "border rounded-2xl p-4 sm:p-6 relative transition-all",
                method.is_default ? "border-emerald-500 shadow-sm" : "border-slate-200"
              )}
            >
              <div className="flex justify-between items-start mb-6 sm:mb-8">
                <div className="w-12 h-10 rounded text-xl flex items-center justify-center shrink-0 border bg-indigo-50 border-indigo-100 text-indigo-700 font-bold italic font-serif">
                  {method.account_type.charAt(0)}
                </div>
                
                <div className="flex items-center">
                  {method.is_default && (
                    <span className="px-3 py-1 bg-emerald-100 flex items-center text-emerald-700 text-xs font-bold rounded-full mr-3">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      Default
                    </span>
                  )}
                  <div className="relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === method.id ? null : method.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {activeDropdown === method.id && (
                      <div className="absolute top-10 right-0 bg-white border border-slate-200 shadow-xl rounded-xl w-48 overflow-hidden z-10">
                        {!method.is_default && (
                          <button 
                            className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 border-b border-slate-100 transition-colors"
                            onClick={() => handleSetDefault(method.id)}
                            disabled={loading}
                          >
                            Set as Default
                          </button>
                        )}
                        <button 
                          className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => handleRemove(method)}
                          disabled={loading}
                        >
                          Remove Card
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-6">
                <div>
                  <div className="text-xs text-slate-500 font-medium mb-1">Account Type</div>
                  <div className="text-sm font-bold text-slate-900">{method.account_type}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium mb-1">Account Number</div>
                  <div className="text-sm font-bold text-slate-900 font-mono tracking-widest">
                    {maskAccountNumber(method.account_number)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium mb-1">Account Holder</div>
                  <div className="text-sm font-medium text-slate-900">{method.account_holder}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium mb-1">Added</div>
                  <div className="text-sm font-medium text-slate-900">
                    {new Date(method.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Security Information Footer */}
        <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 sm:p-8 mt-8 sm:mt-12">
          <h3 className="font-bold text-slate-900 mb-4 sm:mb-6 text-base sm:text-lg">Security Information</h3>
          <ul className="space-y-3 sm:space-y-4">
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-3 mt-2 shrink-0"></div>
              <span className="text-sm text-slate-600">All payment information is encrypted using industry-standard SSL technology</span>
            </li>
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-3 mt-2 shrink-0"></div>
              <span className="text-sm text-slate-600">Your card details are securely stored and never shared with third parties</span>
            </li>
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-3 mt-2 shrink-0"></div>
              <span className="text-sm text-slate-600">We use PCI-DSS compliant payment processors to handle all transactions</span>
            </li>
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-3 mt-2 shrink-0"></div>
              <span className="text-sm text-slate-600">You can remove any saved payment method at any time</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Add Payment Method Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Enter the details of your bank account for withdrawals.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="account-type">Account Type</Label>
              <Input
                id="account-type"
                placeholder="e.g. Bank of America"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-number">Account Number</Label>
              <Input
                id="account-number"
                placeholder="e.g. 1234 5678 9012 3456"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-holder">Account Holder Name</Label>
              <Input
                id="account-holder"
                placeholder="e.g. John Doe"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                className="h-10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAdd} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Add Payment Method
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Confirmation Dialog - FIXED: Moved method details outside DialogDescription */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Payment Method</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this payment method?
            </DialogDescription>
          </DialogHeader>
          
          {/* Method details - moved outside DialogDescription to avoid nesting issues */}
          {selectedMethod && (
            <div className="mt-2 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium">{selectedMethod.account_type}</p>
              <p className="text-xs text-slate-500">{maskAccountNumber(selectedMethod.account_number)}</p>
            </div>
          )}
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmRemove} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}