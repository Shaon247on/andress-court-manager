"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Download,
  DollarSign,
  TrendingUp,
  Clock,
  Wallet,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { withdrawAction } from "@/actions/revenue.action";
import type { RevenueResponse } from "@/types/Revenue.type";
import { toast } from "sonner";
import { format } from "date-fns";

interface RevenueOverviewProps {
  data: RevenueResponse | null;
  errorMessage?: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-orange-100 text-orange-700" },
    paid: { label: "Paid", className: "bg-green-100 text-green-700" },
    rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
    Paid: { label: "Paid", className: "bg-green-100 text-green-700" },
  };
  const { label, className } = statusMap[status] || statusMap.pending;
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded text-[11px] font-bold ${className}`}
    >
      {label}
    </span>
  );
};

export default function RevenueOverview({
  data,
  errorMessage,
}: RevenueOverviewProps) {
  const router = useRouter();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    const res = await withdrawAction({ amount: withdrawAmount });
    if (res.success) {
      toast.success(res.data.message);
      setWithdrawDialogOpen(false);
      setWithdrawAmount("");
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 bg-white overflow-y-auto w-full">
      <div className="mb-6 flex flex-col space-y-1 shrink-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Revenue
        </h1>
        <p className="text-slate-500">View earnings and manage withdrawals</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 shrink-0">
        <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 flex flex-col items-start relative overflow-hidden">
          <div className="text-sm text-slate-500 font-medium mb-1">
            Available Balance
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-purple-600">
            €{parseFloat(data.available_balance).toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1 font-medium">
            Ready to withdraw
          </div>
          <Download className="absolute top-4 right-4 w-5 h-5 text-purple-500" />
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 flex flex-col items-start relative overflow-hidden">
          <div className="text-sm text-slate-500 font-medium mb-1">
            Total Earnings
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            €{parseFloat(data.total_earnings).toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1 font-medium">
            From {data.bookings_count} bookings
          </div>
          <DollarSign className="absolute top-4 right-4 w-5 h-5 text-emerald-500" />
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 flex flex-col items-start relative overflow-hidden">
          <div className="text-sm text-slate-500 font-medium mb-1">
            Total Withdrawn
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-teal-600">
            €{parseFloat(data.total_withdrawn).toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1 font-medium">
            {data.withdrawal_requests.filter((w) => w.status === "paid").length}{" "}
            processed withdrawals
          </div>
          <Wallet className="absolute top-4 right-4 w-5 h-5 text-teal-500" />
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 flex flex-col items-start relative overflow-hidden">
          <div className="text-sm text-slate-500 font-medium mb-1">
            Pending Amount
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-orange-500">
            €{parseFloat(data.pending_amount).toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1 font-medium">
            {data.pending_count} pending
          </div>
          <Clock className="absolute top-4 right-4 w-5 h-5 text-orange-500" />
        </div>
      </div>

      {/* Withdraw Request */}
      <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-4 sm:p-6 mb-8 shrink-0">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4">
          Request Withdrawal
        </h3>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Amount (€)
        </label>
        <div className="flex flex-col sm:flex-row items-center justify-between mb-3">
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              placeholder="Enter amount"
              className="flex-1 h-10 bg-white"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              type="number"
              min="0"
              step="0.01"
            />
            <Button
            variant={"blue"}
              // className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shrink-0 w-full sm:w-auto"
              onClick={() => setWithdrawDialogOpen(true)}
              disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
            >
              Request Withdrawal
            </Button>
          </div>
          <Link href={"/dashboard/settings/payment-methods"}>
            <Button>Add Payment Method</Button>
          </Link>
        </div>
        <p className="text-sm text-slate-500 font-medium">
          Withdrawal requests are processed weekly on Mondays. Maximum
          withdrawal amount: €
          {parseFloat(data.available_balance).toLocaleString()}
        </p>
      </div>

      {/* Withdrawal Requests Table */}
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 shrink-0">
        Withdrawal Requests
      </h3>
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shrink-0 mb-8">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 border-b border-slate-200">
              <TableRow>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">
                  Request Date
                </TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">
                  Code
                </TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">
                  Amount
                </TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">
                  Status
                </TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">
                  Process Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.withdrawal_requests.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No withdrawal requests found.
                  </TableCell>
                </TableRow>
              ) : (
                data.withdrawal_requests.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="px-4 sm:px-6 py-4 text-slate-600 font-medium">
                      {formatDate(row.created_at)}
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-slate-600 font-medium">
                      {row.code}
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 font-bold text-slate-900">
                      €{parseFloat(row.amount).toLocaleString()}
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4">
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-slate-600">
                      {row.process_date ? formatDate(row.process_date) : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {data.withdrawal_requests.length > 0 && (
          <div className="px-4 sm:px-6 py-3 border-t border-slate-200 text-right">
            <Link href="/dashboard/revenue/withdrawals">
              <Button
                variant="outline"
                size="sm"
                className="text-sm font-medium"
              >
                View All Withdrawals
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Earnings Summary Table */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 shrink-0 gap-2">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900">
          Earnings Summary
        </h3>
        <Link href="/dashboard/revenue/earnings">
          <Button
            variant="primary"
            size="sm"
            className="h-9 px-5 rounded-md font-semibold text-sm w-full sm:w-auto"
          >
            See All
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-10 shrink-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 border-b border-slate-200">
              <TableRow>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">
                  Date
                </TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">
                  Booking ID
                </TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">
                  Players
                </TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">
                  Amount
                </TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.earnings_summary.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No earnings found.
                  </TableCell>
                </TableRow>
              ) : (
                data.earnings_summary.map((row, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="px-4 sm:px-6 py-4 text-slate-600 font-medium">
                      {formatDate(row.date)}
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-slate-600">
                      {row.booking_id}
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-slate-600">
                      {row.players}
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 font-bold text-slate-900">
                      €{parseFloat(row.amount).toLocaleString()}
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
      </div>

      {/* Withdraw Confirmation Dialog */}
      <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Withdrawal</DialogTitle>
            <DialogDescription>
              Are you sure you want to withdraw{" "}
              <span className="font-bold">€{withdrawAmount}</span>? This amount
              will be transferred to your default payout method.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setWithdrawDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleWithdraw}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Confirm Withdrawal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
