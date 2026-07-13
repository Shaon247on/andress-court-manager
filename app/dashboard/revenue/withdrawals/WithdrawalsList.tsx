"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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
import type { WithdrawalsListResponse } from '@/types/Revenue.type';
import { format } from 'date-fns';

interface WithdrawalsListProps {
  data: WithdrawalsListResponse | null;
  errorMessage?: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    pending: { label: 'Pending', className: 'bg-orange-100 text-orange-700' },
    paid: { label: 'Paid', className: 'bg-green-100 text-green-700' },
    rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700' },
  };
  const { label, className } = statusMap[status] || statusMap.pending;
  return (
    <span className={`inline-flex px-2.5 py-1 rounded text-[11px] font-bold ${className}`}>
      {label}
    </span>
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

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 bg-white overflow-y-auto w-full">
      <div className="mb-6 flex items-center shrink-0">
        <Link href="/dashboard/revenue" className="p-2 border border-slate-200 bg-white mr-4 rounded-lg hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Withdrawal History</h1>
          <p className="text-slate-500 mt-1">View all your withdrawal requests</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 border-b border-slate-200">
              <TableRow>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">Request Date</TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">Code</TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">Amount</TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">Status</TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">Process Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.results.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No withdrawal requests found.
                  </TableCell>
                </TableRow>
              ) : (
                data.results.map((row) => (
                  <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="px-4 sm:px-6 py-4 text-slate-600 font-medium">
                      {formatDate(row.created_at)}
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-slate-600 font-medium">
                      {row.code}
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 font-bold text-slate-900">
                      ${parseFloat(row.amount).toLocaleString()}
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4">
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-slate-600">
                      {row.process_date ? formatDate(row.process_date) : '—'}
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