"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Users, CreditCard, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from '@/components/common/Pagination';
import type { EarningsListResponse } from '@/types/Revenue.type';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EarningsListProps {
  data: EarningsListResponse | null;
  errorMessage?: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    Paid: { label: 'Paid', className: 'bg-green-100 text-green-700' },
    Pending: { label: 'Pending', className: 'bg-orange-100 text-orange-700' },
  };
  const { label, className } = statusMap[status] || statusMap.Paid;
  return (
    <span className={`inline-flex px-2.5 py-1 rounded text-[11px] font-bold ${className}`}>
      {label}
    </span>
  );
};

// New component for displaying amount with currency
const AmountDisplay = ({ amount, isNet = false }: { amount: string; isNet?: boolean }) => {
  const numAmount = parseFloat(amount);
  return (
    <span className={cn(
      "font-bold",
      isNet ? "text-emerald-600" : "text-slate-900"
    )}>
      €{numAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  );
};

export default function EarningsList({ data, errorMessage }: EarningsListProps) {
  if (errorMessage) {
    return (
      <div className="h-full flex flex-col p-8 bg-white overflow-y-auto w-full">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex flex-col p-8 bg-white overflow-y-auto w-full">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  // Calculate summary statistics
  const totalEarnings = data.results.reduce((sum, item) => sum + parseFloat(item.net_earnings || item.amount || '0'), 0);
  const totalBookingAmount = data.results.reduce((sum, item) => sum + parseFloat(item.booking_amount || '0'), 0);
  const totalCommission = data.results.reduce((sum, item) => sum + parseFloat(item.platform_commission || '0'), 0);
  const totalFees = data.results.reduce((sum, item) => sum + parseFloat(item.transaction_fee || '0'), 0);
  const uniquePlayers = new Set(data.results.flatMap(item => item.players.split(', '))).size;

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 bg-white overflow-y-auto w-full">
      {/* Header */}
      <div className="mb-6 flex items-center shrink-0">
        <Link href="/dashboard/revenue" className="p-2 border border-slate-200 bg-white mr-4 rounded-lg hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Earnings History</h1>
          <p className="text-slate-500 mt-1">View all your earnings from bookings</p>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Net Earnings</p>
              <p className="text-2xl font-bold text-emerald-600">
                €{totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">After platform fees & commission</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Bookings</p>
              <p className="text-2xl font-bold text-slate-900">
                €{totalBookingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">{data.results.length} bookings</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Platform Commission</p>
              <p className="text-2xl font-bold text-amber-600">
                €{totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">Platform service fee</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Transaction Fees</p>
              <p className="text-2xl font-bold text-purple-600">
                €{totalFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">{uniquePlayers} unique players</p>
        </div>
      </div>

      {/* Earnings Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 border-b border-slate-200">
              <TableRow>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">Date</TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">Booking ID</TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">Players</TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">Booking Amount</TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">Commission</TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">Transaction Fee</TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">Net Earnings</TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.results.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="px-6 py-8 text-center text-slate-500">
                    No earnings found.
                  </TableCell>
                </TableRow>
              ) : (
                data.results.map((row, index) => (
                  <TableRow key={index} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="px-4 sm:px-6 py-4 text-slate-600 font-medium whitespace-nowrap">
                      {formatDate(row.date)}
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-slate-600 font-mono text-sm">
                      {row.booking_id || '—'}
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-slate-600">
                      {row.players}
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4">
                      <AmountDisplay amount={row.booking_amount} />
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-amber-600">
                      -€{parseFloat(row.platform_commission).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-purple-600">
                      -€{parseFloat(row.transaction_fee).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4">
                      <AmountDisplay amount={row.net_earnings || row.amount} isNet />
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4">
                      <StatusBadge status={row.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {data.pagination && data.pagination.total_pages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-slate-200">
            <Pagination total={data.pagination.count} pageSize={data.pagination.page_size} />
          </div>
        )}
      </div>
    </div>
  );
}