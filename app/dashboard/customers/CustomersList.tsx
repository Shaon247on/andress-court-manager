"use client";

import React, { useState } from 'react';
import { Gift , Ban, UserPlus, MoreVertical, Eye, Plus, Loader2, X, Percent, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import SearchInput from '@/components/common/SearchInput';
import Pagination from '@/components/common/Pagination';
import { blockCustomerAction, unblockCustomerAction, addBenefitAction } from '@/actions/customer.action';
import type { Customer } from '@/types/Customer.type';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomersListProps {
  customers: Customer[];
  pagination: {
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
  } | null;
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

export default function CustomersList({
  customers = [],
  pagination = null,
  errorMessage,
}: CustomersListProps) {
  const router = useRouter();
  const [filterType, setFilterType] = useState<'all' | 'benefits'>('all');
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [blocking, setBlocking] = useState(false);

  // Add Benefit states
  const [addBenefitOpen, setAddBenefitOpen] = useState(false);
  const [benefitCustomer, setBenefitCustomer] = useState<Customer | null>(null);
  const [benefitType, setBenefitType] = useState<'percentage' | 'fixed'>('percentage');
  const [benefitValue, setBenefitValue] = useState('10');
  const [applyOn, setApplyOn] = useState<'split' | 'full' | 'all'>('split');
  const [usagePerDay, setUsagePerDay] = useState(1);
  const [usagePerMonth, setUsagePerMonth] = useState(10);
  const [addingBenefit, setAddingBenefit] = useState(false);

  const handleFilterChange = (filter: 'all' | 'benefits') => {
    setFilterType(filter);
    const params = new URLSearchParams(window.location.search);
    params.set('filter', filter);
    router.push(`/dashboard/customers?${params.toString()}`);
  };

  const handleBlockToggle = (customer: Customer) => {
    setSelectedCustomer(customer);
    setBlockDialogOpen(true);
  };

  const confirmBlockToggle = async () => {
    if (!selectedCustomer) return;
    setBlocking(true);
    
    const action = selectedCustomer.is_blocked 
      ? unblockCustomerAction(selectedCustomer.id)
      : blockCustomerAction(selectedCustomer.id);
    
    const res = await action;
    if (res.success) {
      toast.success(res.data.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setBlocking(false);
    setBlockDialogOpen(false);
    setSelectedCustomer(null);
  };

  const handleAddBenefit = (customer: Customer) => {
    // Check if customer already has a benefit
    if (customer.benefits > 0) {
      toast.error("This customer already has a benefit. Only one benefit is allowed per customer.");
      return;
    }
    
    setBenefitCustomer(customer);
    setAddBenefitOpen(true);
    // Reset form
    setBenefitType('percentage');
    setBenefitValue('10');
    setApplyOn('split');
    setUsagePerDay(1);
    setUsagePerMonth(10);
  };

  const confirmAddBenefit = async () => {
    if (!benefitCustomer) return;
    setAddingBenefit(true);
    
    const res = await addBenefitAction(benefitCustomer.user_id, {
      benefit_type: benefitType,
      value: benefitValue,
      apply_on: applyOn,
      usage_per_day: usagePerDay,
      usage_per_month: usagePerMonth,
    });
    
    if (res.success) {
      toast.success(res.data.message);
      setAddBenefitOpen(false);
      setBenefitCustomer(null);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setAddingBenefit(false);
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
      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 shrink-0">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-start sm:items-center w-full md:w-auto">
          <div className="w-full sm:w-80">
            <SearchInput name="search" placeholder="Search by name, email, or phone..." />
          </div>
          <div className="flex border border-slate-200 rounded-md overflow-hidden bg-slate-50 p-1 w-full sm:w-auto">
            <button 
              onClick={() => handleFilterChange('all')}
              className={cn(
                "px-3 sm:px-4 py-1.5 rounded text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none",
                filterType === 'all' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-200'
              )}
            >
              All Customers
            </button>
            <button 
              onClick={() => handleFilterChange('benefits')}
              className={cn(
                "px-3 sm:px-4 py-1.5 rounded text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none",
                filterType === 'benefits' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-200'
              )}
            >
              With Benefits
            </button>
          </div>
        </div>

        <Link href="/dashboard/customers/add" className="w-full sm:w-auto">
          <Button variant="primary" className="h-10 px-4 cursor-pointer w-full sm:w-auto">
            <UserPlus className="w-4 h-4 mr-2" /> Add Customer
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white border-b border-slate-200">
              <TableRow>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold">Name</TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold hidden sm:table-cell">Phone</TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold hidden md:table-cell">Email</TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Games</TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold">Benefits</TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold">Status</TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-slate-50/50">
                    <TableCell className="px-4 sm:px-6 py-4">
                      <div className="font-semibold text-slate-900">{customer.full_name}</div>
                      <div className="text-xs text-slate-500">{customer.country || 'N/A'}</div>
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-slate-600 font-medium hidden sm:table-cell">
                      {customer.phone || 'N/A'}
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-slate-600 hidden md:table-cell">
                      {customer.email}
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {customer.total_games} games
                      </span>
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4">
                      {customer.benefits > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          <Gift className="w-3 h-3 mr-1" /> {customer.benefits} active
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">None</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4">
                      <StatusBadge isBlocked={customer.is_blocked} />
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link 
                              href={`/dashboard/customers/${customer.user_id}`}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                              <span>View Details</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAddBenefit(customer)}
                            className={cn(
                              "flex items-center gap-2 cursor-pointer",
                              customer.benefits > 0 
                                ? "text-slate-400 cursor-not-allowed opacity-50" 
                                : "text-primary hover:text-primary"
                            )}
                            disabled={customer.benefits > 0}
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add Benefit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleBlockToggle(customer)}
                            className={cn(
                              "flex items-center gap-2 cursor-pointer",
                              customer.is_blocked 
                                ? "text-green-600 hover:text-green-700" 
                                : "text-red-600 hover:text-red-700"
                            )}
                          >
                            <Ban className="h-4 w-4" />
                            <span>{customer.is_blocked ? 'Unblock' : 'Block'} Customer</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {pagination && pagination.total_pages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-slate-200">
            <Pagination total={pagination.count} pageSize={pagination.page_size} />
          </div>
        )}
      </div>

      {/* Block/Unblock Dialog */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCustomer?.is_blocked ? 'Unblock Customer' : 'Block Customer'}
            </DialogTitle>
            <DialogDescription>
              {selectedCustomer?.is_blocked 
                ? `Are you sure you want to unblock ${selectedCustomer?.full_name}? They will regain full access.`
                : `Are you sure you want to block ${selectedCustomer?.full_name}? They will lose access to the platform.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockDialogOpen(false)} disabled={blocking}>
              Cancel
            </Button>
            <Button 
              variant={selectedCustomer?.is_blocked ? 'success' : 'danger'}
              onClick={confirmBlockToggle}
              disabled={blocking}
            >
              {blocking ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {selectedCustomer?.is_blocked ? 'Unblock' : 'Block'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Benefit Dialog */}
      <Dialog open={addBenefitOpen} onOpenChange={setAddBenefitOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Benefit</DialogTitle>
            <DialogDescription>
              Add a new benefit for {benefitCustomer?.full_name}
            </DialogDescription>
          </DialogHeader>
          
          {/* Show warning if customer already has a benefit */}
          {benefitCustomer && benefitCustomer.benefits > 0 && (
            <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
              <p className="font-medium">Warning: Customer already has a benefit</p>
              <p className="mt-1">Only one benefit is allowed per customer. Please remove the existing benefit first.</p>
            </div>
          )}

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Benefit Type</Label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setBenefitType('percentage')}
                  disabled={benefitCustomer?.benefits ? benefitCustomer.benefits > 0 : false}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm font-medium transition-colors flex-1",
                    benefitType === 'percentage' 
                      ? "border-primary bg-primary/10 text-primary" 
                      : "border-slate-200 hover:border-slate-300",
                    benefitCustomer?.benefits && benefitCustomer.benefits > 0 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Percent className="w-4 h-4 inline mr-2" />
                  Percentage
                </button>
                <button
                  type="button"
                  onClick={() => setBenefitType('fixed')}
                  disabled={benefitCustomer?.benefits ? benefitCustomer.benefits > 0 : false}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm font-medium transition-colors flex-1",
                    benefitType === 'fixed' 
                      ? "border-primary bg-primary/10 text-primary" 
                      : "border-slate-200 hover:border-slate-300",
                    benefitCustomer?.benefits && benefitCustomer.benefits > 0 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Fixed Amount
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefit-value">Value ({benefitType === 'percentage' ? '%' : '$'})</Label>
              <Input
                id="benefit-value"
                type="number"
                value={benefitValue}
                onChange={(e) => setBenefitValue(e.target.value)}
                placeholder={benefitType === 'percentage' ? '10' : '5.00'}
                min="0"
                step="0.01"
                disabled={benefitCustomer?.benefits ? benefitCustomer.benefits > 0 : false}
              />
            </div>

            <div className="space-y-2">
              <Label>Apply On</Label>
              <Select 
                value={applyOn} 
                onValueChange={(val) => setApplyOn(val as 'split' | 'full' | 'all')}
                disabled={benefitCustomer?.benefits ? benefitCustomer.benefits > 0 : false}
              >
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
                <Label htmlFor="usage-per-day">Usage Per Day</Label>
                <Input
                  id="usage-per-day"
                  type="number"
                  value={usagePerDay}
                  onChange={(e) => setUsagePerDay(parseInt(e.target.value) || 0)}
                  min={0}
                  disabled={benefitCustomer?.benefits ? benefitCustomer.benefits > 0 : false}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usage-per-month">Usage Per Month</Label>
                <Input
                  id="usage-per-month"
                  type="number"
                  value={usagePerMonth}
                  onChange={(e) => setUsagePerMonth(parseInt(e.target.value) || 0)}
                  min={0}
                  disabled={benefitCustomer?.benefits ? benefitCustomer.benefits > 0 : false}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddBenefitOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={confirmAddBenefit}
              disabled={addingBenefit || (benefitCustomer?.benefits ? benefitCustomer.benefits > 0 : false)}
            >
              {addingBenefit ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Add Benefit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}