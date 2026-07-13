// app/dashboard/customers/[id]/CustomerDetails.tsx

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Gift, 
  Edit2, 
  Ban, 
  Plus, 
  Trash2, 
  Loader2,
  Percent,
  DollarSign,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { addBenefitAction, removeBenefitAction, blockCustomerAction, unblockCustomerAction } from '@/actions/customer.action';
import type { Customer, Benefit } from '@/types/Customer.type';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CustomerDetailsProps {
  customer: Customer;
  benefits: Benefit[];
  errorMessage?: string;
}

const StatusBadge = ({ isBlocked }: { isBlocked: boolean }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
      )}
    >
      {isBlocked ? "Blocked" : "Active"}
    </span>
  );
};

const BenefitTypeBadge = ({ type }: { type: string }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium",
        type === 'percentage' ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
      )}
    >
      {type === 'percentage' ? <Percent className="w-3 h-3 mr-1" /> : <DollarSign className="w-3 h-3 mr-1" />}
      {type === 'percentage' ? 'Percentage' : 'Fixed'}
    </span>
  );
};

export default function CustomerDetails({ customer, benefits, errorMessage }: CustomerDetailsProps) {
  const router = useRouter();
  const [isBlocking, setIsBlocking] = useState(false);
  const [isAddBenefitOpen, setIsAddBenefitOpen] = useState(false);
  const [isRemoveBenefitOpen, setIsRemoveBenefitOpen] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [addingBenefit, setAddingBenefit] = useState(false);
  const [removingBenefit, setRemovingBenefit] = useState(false);

  // Benefit form state
  const [benefitType, setBenefitType] = useState<'percentage' | 'fixed'>('percentage');
  const [benefitValue, setBenefitValue] = useState('10');
  const [applyOn, setApplyOn] = useState<'split' | 'full' | 'all'>('split');
  const [usagePerDay, setUsagePerDay] = useState(1);
  const [usagePerMonth, setUsagePerMonth] = useState(10);

  const handleBlockToggle = async () => {
    setIsBlocking(true);
    const action = customer.is_blocked 
      ? unblockCustomerAction(customer.id)
      : blockCustomerAction(customer.id);
    
    const res = await action;
    if (res.success) {
      toast.success(res.data.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setIsBlocking(false);
  };

  const handleAddBenefit = async () => {
    setAddingBenefit(true);
    const res = await addBenefitAction(customer.id, {
      benefit_type: benefitType,
      value: benefitValue,
      apply_on: applyOn,
      usage_per_day: usagePerDay,
      usage_per_month: usagePerMonth,
    });
    
    if (res.success) {
      toast.success(res.data.message);
      setIsAddBenefitOpen(false);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setAddingBenefit(false);
  };

  const handleRemoveBenefit = async () => {
    if (!selectedBenefit) return;
    setRemovingBenefit(true);
    const res = await removeBenefitAction(customer.id, selectedBenefit.id);
    
    if (res.success) {
      toast.success(res.data.message);
      setIsRemoveBenefitOpen(false);
      setSelectedBenefit(null);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setRemovingBenefit(false);
  };

  const getApplyOnLabel = (applyOn: string) => {
    switch (applyOn) {
      case 'split': return 'Split Payment';
      case 'full': return 'Full Payment';
      case 'all': return 'Both';
      default: return applyOn;
    }
  };

  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {errorMessage}
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/customers">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{customer.full_name}</h1>
            <p className="text-sm text-slate-500">{customer.code} • {customer.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge isBlocked={customer.is_blocked} />
          <Button 
            variant={customer.is_blocked ? 'success' : 'danger'}
            size="sm"
            onClick={handleBlockToggle}
            disabled={isBlocking}
          >
            {isBlocking ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Ban className="w-4 h-4 mr-2" />
            )}
            {customer.is_blocked ? 'Unblock' : 'Block'}
          </Button>
          <Link href={`/dashboard/customers/${customer.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Full Name</p>
                    <p className="text-sm font-medium text-slate-900">{customer.full_name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Email</p>
                    <p className="text-sm font-medium text-slate-900">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Phone</p>
                    <p className="text-sm font-medium text-slate-900">{customer.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Country</p>
                    <p className="text-sm font-medium text-slate-900">{customer.country || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-slate-400 mt-0.5 font-bold text-xs text-center">#</div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Total Games</p>
                    <p className="text-sm font-medium text-slate-900">{customer.total_games}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Gift className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Active Benefits</p>
                    <p className="text-sm font-medium text-slate-900">{customer.benefits}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Customer Since</span>
                <span className="text-sm font-medium text-slate-900">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Total Games</span>
                <span className="text-sm font-medium text-slate-900">{customer.total_games}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Active Benefits</span>
                <span className="text-sm font-medium text-slate-900">{customer.benefits}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Benefits
          </h2>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setIsAddBenefitOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Benefit
          </Button>
        </div>

        {benefits.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-slate-500">
              No benefits added yet. Click &ldquo;Add Benefit&ldquo; to get started.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit) => (
              <Card key={benefit.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <BenefitTypeBadge type={benefit.benefit_type} />
                        <span className="text-sm font-bold text-slate-900">
                          {benefit.benefit_type === 'percentage' ? `${benefit.value}%` : `$${benefit.value}`}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500">
                          Apply on: <span className="font-medium text-slate-700">{getApplyOnLabel(benefit.apply_on)}</span>
                        </p>
                        <p className="text-xs text-slate-500">
                          Usage: <span className="font-medium text-slate-700">{benefit.usage_per_day} per day • {benefit.usage_per_month} per month</span>
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Added: {new Date(benefit.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setSelectedBenefit(benefit);
                        setIsRemoveBenefitOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Benefit Dialog */}
      <Dialog open={isAddBenefitOpen} onOpenChange={setIsAddBenefitOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Benefit</DialogTitle>
            <DialogDescription>
              Add a new benefit for {customer.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Benefit Type</Label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setBenefitType('percentage')}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                    benefitType === 'percentage' 
                      ? "border-primary bg-primary/10 text-primary" 
                      : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <Percent className="w-4 h-4 inline mr-2" />
                  Percentage
                </button>
                <button
                  type="button"
                  onClick={() => setBenefitType('fixed')}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                    benefitType === 'fixed' 
                      ? "border-primary bg-primary/10 text-primary" 
                      : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Fixed Amount
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Value ({benefitType === 'percentage' ? '%' : '$'})</Label>
              <Input
                id="value"
                type="number"
                value={benefitValue}
                onChange={(e) => setBenefitValue(e.target.value)}
                placeholder={benefitType === 'percentage' ? '10' : '5.00'}
              />
            </div>

            <div className="space-y-2">
              <Label>Apply On</Label>
              <Select value={applyOn} onValueChange={(val) => setApplyOn(val as 'split' | 'full' | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select where to apply" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="split">Split Payment</SelectItem>
                  <SelectItem value="full">Full Payment</SelectItem>
                  <SelectItem value="all">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usagePerDay">Usage Per Day</Label>
                <Input
                  id="usagePerDay"
                  type="number"
                  value={usagePerDay}
                  onChange={(e) => setUsagePerDay(parseInt(e.target.value) || 0)}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usagePerMonth">Usage Per Month</Label>
                <Input
                  id="usagePerMonth"
                  type="number"
                  value={usagePerMonth}
                  onChange={(e) => setUsagePerMonth(parseInt(e.target.value) || 0)}
                  min={0}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddBenefitOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleAddBenefit}
              disabled={addingBenefit}
            >
              {addingBenefit ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Add Benefit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Benefit Dialog - FIXED: Moved benefit details outside DialogDescription */}
      <Dialog open={isRemoveBenefitOpen} onOpenChange={setIsRemoveBenefitOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Benefit</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this benefit for {customer.full_name}?
            </DialogDescription>
          </DialogHeader>
          
          {/* Moved benefit details outside DialogDescription to avoid nesting issues */}
          {selectedBenefit && (
            <div className="mt-2 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium">
                {selectedBenefit.benefit_type === 'percentage' 
                  ? `${selectedBenefit.value}%` 
                  : `$${selectedBenefit.value}`}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Apply on: {getApplyOnLabel(selectedBenefit.apply_on)}
              </p>
            </div>
          )}
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsRemoveBenefitOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleRemoveBenefit}
              disabled={removingBenefit}
            >
              {removingBenefit ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Remove Benefit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}