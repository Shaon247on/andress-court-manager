// app/dashboard/revenue/components/RevenueOverview.tsx

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
  Users,
  CreditCard,
  Receipt,
  AlertCircle,
  Info,
  Eye,
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { cn } from "@/lib/utils";

interface RevenueOverviewProps {
  data: RevenueResponse | null;
  errorMessage?: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-orange-100 text-orange-700 border-orange-200" },
    paid: { label: "Paid", className: "bg-green-100 text-green-700 border-green-200" },
    rejected: { label: "Rejected", className: "bg-red-100 text-red-700 border-red-200" },
    Paid: { label: "Paid", className: "bg-green-100 text-green-700 border-green-200" },
  };
  const { label, className } = statusMap[status] || statusMap.pending;
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium border ${className}`}
    >
      {label}
    </span>
  );
};

// ── Reject Reason Cell Component ──
const RejectReasonCell = ({ reason }: { reason?: string }) => {
  const hasReason = reason && reason.trim() !== '';
  
  if (!hasReason) {
    return <span className="text-slate-400 text-sm font-medium">—</span>;
  }

  // Truncate reason for display (show first 40 characters)
  const displayText = reason.length > 40 ? reason.slice(0, 40) + '...' : reason;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 cursor-help group max-w-[200px]">
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
            <p className="text-[10px] text-red-500/70 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Hover to see full reason
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Amount display component
const AmountDisplay = ({ amount, className }: { amount: string; className?: string }) => {
  const numAmount = parseFloat(amount);
  return (
    <span className={cn("font-bold", className)}>
      €{numAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

  // Calculate platform expenses from earnings summary
  const totalPlatformCommission = data.earnings_summary.reduce(
    (sum, item) => sum + parseFloat(item.platform_commission || '0'), 
    0
  );
  const totalTransactionFees = data.earnings_summary.reduce(
    (sum, item) => sum + parseFloat(item.transaction_fee || '0'), 
    0
  );
  const totalPlatformExpenses = totalPlatformCommission + totalTransactionFees;

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
    <TooltipProvider>
      <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 bg-white overflow-y-auto w-full">
        <div className="mb-6 flex flex-col space-y-1 shrink-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Revenue
          </h1>
          <p className="text-slate-500">View earnings and manage withdrawals</p>
        </div>

        {/* Stats Cards - Now 5 cards in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8 shrink-0">
          {/* Available Balance */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 flex flex-col items-start relative overflow-hidden">
            <div className="text-sm text-slate-500 font-medium mb-1">
              Available Balance
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-purple-600">
              <AmountDisplay amount={data.available_balance} />
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              Ready to withdraw
            </div>
            <Download className="absolute top-4 right-4 w-5 h-5 text-purple-500" />
          </div>

          {/* Total Earnings */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 flex flex-col items-start relative overflow-hidden">
            <div className="text-sm text-slate-500 font-medium mb-1">
              Total Earnings
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
              <AmountDisplay amount={data.total_earnings} />
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              From {data.bookings_count} bookings
            </div>
            <DollarSign className="absolute top-4 right-4 w-5 h-5 text-emerald-500" />
          </div>

          {/* Total Withdrawn */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 flex flex-col items-start relative overflow-hidden">
            <div className="text-sm text-slate-500 font-medium mb-1">
              Total Withdrawn
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-teal-600">
              <AmountDisplay amount={data.total_withdrawn} />
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              {data.withdrawal_requests.filter((w) => w.status === "paid").length}{" "}
              processed withdrawals
            </div>
            <Wallet className="absolute top-4 right-4 w-5 h-5 text-teal-500" />
          </div>

          {/* Pending Amount */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 flex flex-col items-start relative overflow-hidden">
            <div className="text-sm text-slate-500 font-medium mb-1">
              Pending Amount
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-orange-500">
              <AmountDisplay amount={data.pending_amount} />
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              {data.pending_count} pending
            </div>
            <Clock className="absolute top-4 right-4 w-5 h-5 text-orange-500" />
          </div>

          {/* NEW: Platform Expenses Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 flex flex-col items-start relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100/50">
            <div className="text-sm text-slate-500 font-medium mb-1">
              Platform Expenses
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-rose-600">
              <AmountDisplay amount={totalPlatformExpenses.toFixed(2)} />
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium flex items-center gap-2">
              <span>Commission: <AmountDisplay amount={totalPlatformCommission.toFixed(2)} className="text-amber-600" /></span>
              <span className="text-slate-300">|</span>
              <span>Fees: <AmountDisplay amount={totalTransactionFees.toFixed(2)} className="text-purple-600" /></span>
            </div>
            <Receipt className="absolute top-4 right-4 w-5 h-5 text-rose-500" />
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
            withdrawal amount:{" "}
            <AmountDisplay amount={data.available_balance} />
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
                  <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold min-w-[150px]">
                    <div className="flex items-center gap-1.5">
                      <span>Reject Reason</span>
                      <Info className="w-3 h-3 text-slate-400" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.withdrawal_requests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      No withdrawal requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.withdrawal_requests.map((row) => {
                    const hasRejectReason = row.status === 'rejected' && row.reject_reason && row.reject_reason.trim() !== '';
                    
                    return (
                      <TableRow
                        key={row.id}
                        className={cn(
                          "hover:bg-slate-50/50 transition-colors",
                          row.status === 'rejected' && "bg-red-50/30 hover:bg-red-50/50"
                        )}
                      >
                        <TableCell className="px-4 sm:px-6 py-4 text-slate-600 font-medium">
                          {formatDate(row.created_at)}
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4 text-slate-600 font-medium">
                          {row.code}
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4 font-bold text-slate-900">
                          <AmountDisplay amount={row.amount} />
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4">
                          <StatusBadge status={row.status} />
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4 text-slate-600">
                          {row.process_date ? formatDate(row.process_date) : "—"}
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
                    Booking Amount
                  </TableHead>
                  <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">
                    Commission
                  </TableHead>
                  <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">
                    Fee
                  </TableHead>
                  <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">
                    Net Earnings
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
                      colSpan={8}
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      No earnings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.earnings_summary.slice(0, 5).map((row, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell className="px-4 sm:px-6 py-4 text-slate-600 font-medium">
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
                        -<AmountDisplay amount={row.platform_commission} />
                      </TableCell>
                      <TableCell className="px-4 sm:px-6 py-4 text-purple-600">
                        -<AmountDisplay amount={row.transaction_fee} />
                      </TableCell>
                      <TableCell className="px-4 sm:px-6 py-4">
                        <AmountDisplay amount={row.net_earnings || row.amount} className="text-emerald-600" />
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
    </TooltipProvider>
  );
}