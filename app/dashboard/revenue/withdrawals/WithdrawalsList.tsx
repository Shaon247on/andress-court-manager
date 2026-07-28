// app/dashboard/revenue/components/WithdrawalsList.tsx

"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Info, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Pagination from '@/components/common/Pagination';
import type { WithdrawalsListResponse } from '@/types/Revenue.type';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface WithdrawalsListProps {
  data: WithdrawalsListResponse | null;
  errorMessage?: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    pending: { label: 'Pending', className: 'bg-orange-100 text-orange-700 border-orange-200' },
    paid: { label: 'Paid', className: 'bg-green-100 text-green-700 border-green-200' },
    rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700 border-red-200' },
  };
  const { label, className } = statusMap[status] || statusMap.pending;
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium border ${className}`}>
      {label}
    </span>
  );
};

const RejectReasonCell = ({ reason }: { reason?: string }) => {
  const hasReason = reason && reason.trim() !== '';
  
  if (!hasReason) {
    return (
      <span className="text-slate-400 text-sm font-medium">—</span>
    );
  }

  // Truncate reason for display (show first 40 characters)
  const displayText = reason.length > 40 ? reason.slice(0, 40) + '...' : reason;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 cursor-default group max-w-[200px]">
            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 group-hover:text-red-500 transition-colors" />
            <span className="text-sm text-slate-600 truncate group-hover:text-slate-900 transition-colors">
              {displayText}
            </span>
            <Info className="w-3 h-3 text-slate-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-[350px] bg-red-50 border border-red-200 text-red-800 p-4 shadow-lg"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-xs font-semibold text-red-700 uppercase tracking-wider">Rejection Reason</p>
            </div>
            <p className="text-sm leading-relaxed font-medium">{reason}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default function WithdrawalsList({ data, errorMessage }: WithdrawalsListProps) {
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

  const formatFullDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch {
      return dateString;
    }
  };

  // ── Calculate summary stats ──
  const totalRequests = data.results.length;
  const totalAmount = data.results.reduce((sum, r) => sum + parseFloat(r.amount), 0);
  const pendingCount = data.results.filter(r => r.status === 'pending').length;
  const rejectedCount = data.results.filter(r => r.status === 'rejected').length;
  const paidCount = data.results.filter(r => r.status === 'paid').length;

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 bg-white overflow-y-auto w-full">
        {/* Header */}
        <div className="mb-6 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link 
                href="/dashboard/revenue" 
                className="p-2 border border-slate-200 bg-white mr-4 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Withdrawal History</h1>
                <p className="text-slate-500 mt-1">View all your withdrawal requests</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 shrink-0">
          <div className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Total Requests</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900">{totalRequests}</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-3 sm:p-4 border border-emerald-100">
            <p className="text-xs text-emerald-600 font-medium">Total Amount</p>
            <p className="text-lg sm:text-xl font-bold text-emerald-700">
              €{totalAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 sm:p-4 border border-amber-100">
            <p className="text-xs text-amber-600 font-medium">Pending</p>
            <p className="text-lg sm:text-xl font-bold text-amber-700">{pendingCount}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3 sm:p-4 border border-red-100">
            <p className="text-xs text-red-600 font-medium">Rejected</p>
            <p className="text-lg sm:text-xl font-bold text-red-700">{rejectedCount}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 border-b border-slate-200">
                <TableRow>
                  <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold whitespace-nowrap">
                    Request Date
                  </TableHead>
                  <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold whitespace-nowrap">
                    Code
                  </TableHead>
                  <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold whitespace-nowrap">
                    Amount
                  </TableHead>
                  <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold whitespace-nowrap">
                    Status
                  </TableHead>
                  <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold whitespace-nowrap">
                    Process Date
                  </TableHead>
                  <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold whitespace-nowrap min-w-[150px]">
                    <div className="flex items-center gap-1.5">
                      <span>Reject Reason</span>
                      <Info className="w-3 h-3 text-slate-400" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.results.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      No withdrawal requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.results.map((row) => {
                    const hasRejectReason = row.status === 'rejected' && row.reject_reason && row.reject_reason.trim() !== '';
                    
                    return (
                      <TableRow 
                        key={row.id} 
                        className={cn(
                          "hover:bg-slate-50/50 transition-colors",
                          row.status === 'rejected' && "bg-red-50/30 hover:bg-red-50/50"
                        )}
                      >
                        <TableCell className="px-4 sm:px-6 py-4 text-slate-600 font-medium whitespace-nowrap">
                          {formatDate(row.created_at)}
                          <span className="block text-xs text-slate-400 font-normal">
                            {formatFullDate(row.created_at)}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4 text-slate-600 font-mono font-medium text-xs whitespace-nowrap">
                          {row.code}
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                          €{parseFloat(row.amount).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4">
                          <StatusBadge status={row.status} />
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4 text-slate-600 whitespace-nowrap">
                          {row.process_date ? (
                            <>
                              {formatDate(row.process_date)}
                              <span className="block text-xs text-slate-400 font-normal">
                                {formatFullDate(row.process_date)}
                              </span>
                            </>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4">
                          <RejectReasonCell reason={hasRejectReason ? row.reject_reason : undefined} />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          {data.pagination && data.pagination.total_pages > 1 && (
            <div className="px-4 sm:px-6 py-4 border-t border-slate-200 shrink-0">
              <Pagination total={data.pagination.count} pageSize={data.pagination.page_size} />
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}