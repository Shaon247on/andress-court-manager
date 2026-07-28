"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { format, addDays, subDays } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Filter,
  Eye,
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import { Card, CardContent } from "@/components/ui/card";
import type { BookingListItem, BookingCards } from "@/types/Booking.type";
import { cn } from "@/lib/utils";

interface BookingsListProps {
  bookings: BookingListItem[];
  cards: BookingCards | null;
  pagination: {
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
  } | null;
  currentDate: string;
  errorMessage?: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    confirmed: { label: "Confirmed", className: "bg-green-100 text-green-800" },
    completed: { label: "Completed", className: "bg-blue-100 text-blue-800" },
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
    cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800" },
  };
  const { label, className } = statusMap[status] || statusMap.pending;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
};

const BookingTypeBadge = ({ type }: { type: string }) => {
  const typeMap: Record<string, { label: string; className: string }> = {
    regular: { label: "Booking", className: "bg-blue-100 text-blue-800" },
    lesson: { label: "Lesson", className: "bg-orange-100 text-orange-800" },
    event: { label: "Event", className: "bg-purple-100 text-purple-800" },
  };
  const { label, className } = typeMap[type] || typeMap.regular;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
};

const PaymentTypeBadge = ({ type }: { type: string }) => {
  const typeMap: Record<string, { label: string; className: string }> = {
    single: { label: "Single", className: "bg-slate-100 text-slate-700" },
    split: { label: "Split", className: "bg-emerald-100 text-emerald-700" },
    full: { label: "Full", className: "bg-blue-100 text-blue-700" },
  };
  const { label, className } = typeMap[type] || typeMap.single;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${className}`}
    >
      {label}
    </span>
  );
};

const TypeFilterOptions = [
  { label: "All", value: "all" },
  { label: "Bookings", value: "bookings" },
  { label: "Lessons", value: "lessons" },
  { label: "Events", value: "events" },
];

// Amount display component
const AmountDisplay = ({ amount, className }: { amount: string | null; className?: string }) => {
  if (amount === null || amount === undefined) return <span className="text-slate-400">—</span>;
  const numAmount = parseFloat(amount);
  return (
    <span className={cn("font-bold", className)}>
      €{numAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  );
};

export default function BookingsList({
  bookings = [],
  cards = null,
  pagination = null,
  currentDate: initialDate,
  errorMessage,
}: BookingsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentDate, setCurrentDate] = useState<Date>(new Date(initialDate));
  const [filterType, setFilterType] = useState<string>(
    searchParams.get("type") || "all",
  );

  const navigateToDate = (date: Date) => {
    setCurrentDate(date);
    const formatted = format(date, "yyyy-MM-dd");
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", formatted);
    if (filterType !== "all") {
      params.set("type", filterType);
    } else {
      params.delete("type");
    }
    router.push(`/dashboard/bookings?${params.toString()}`);
  };

  useEffect(() => {
    const dateParam = searchParams.get("date");
    if (dateParam) {
      setCurrentDate(new Date(dateParam));
    }
  }, [searchParams]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [year, month, day] = e.target.value.split("-").map(Number);
      navigateToDate(new Date(year, month - 1, day));
    }
  };

  const handleTypeChange = (type: string) => {
    setFilterType(type);
    const params = new URLSearchParams(searchParams.toString());
    if (type !== "all") {
      params.set("type", type);
    } else {
      params.delete("type");
    }
    params.delete("page");
    router.push(`/dashboard/bookings?${params.toString()}`);
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
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 shrink-0">
        <Card className="border border-slate-200 shadow-none rounded-lg">
          <CardContent className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-medium text-slate-500">
                Total Bookings
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">
                {cards?.total_bookings ?? 0}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 shadow-none rounded-lg">
          <CardContent className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-medium text-slate-500">
                Available Slots
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">
                {cards?.available_slots ?? 0}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 shadow-none rounded-lg">
          <CardContent className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-medium text-slate-500">
                Utilization
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">
                {cards?.utilization ?? 0}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date Picker and Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 shrink-0 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {TypeFilterOptions.map((type) => (
            <button
              key={type.value}
              onClick={() => handleTypeChange(type.value)}
              className={cn(
                "px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors",
                filterType === type.value
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              )}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center w-full lg:w-auto">
          <button
            onClick={() => navigateToDate(subDays(currentDate, 1))}
            className="p-2 hover:bg-slate-100 rounded-md shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
          </button>
          <div className="font-bold text-slate-900 text-sm sm:text-lg mx-2 sm:mx-4 min-w-[120px] sm:min-w-[200px] text-center truncate">
            {format(currentDate, "EEEE, MMMM d, yyyy")}
          </div>
          <Button
            variant="primary"
            size="sm"
            className="mr-2 sm:mr-4 shrink-0 text-xs sm:text-sm"
            onClick={() => navigateToDate(new Date())}
          >
            Today
          </Button>
          <button
            onClick={() => navigateToDate(addDays(currentDate, 1))}
            className="p-2 hover:bg-slate-100 rounded-md shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
          </button>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-100">
          <div className="flex items-center border border-slate-200 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-white flex-1 lg:flex-none">
            <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 mr-1 sm:mr-2 shrink-0" />
            <Input
              type="date"
              className="border-none p-0 h-auto text-xs sm:text-sm text-slate-700 w-full bg-transparent focus:ring-0"
              value={format(currentDate, "yyyy-MM-dd")}
              onChange={handleDateChange}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Court</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                  Time
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Players</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Amount</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                  Commission
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                  Fee
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 hidden xl:table-cell">
                  Net Earnings
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                  Payment
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Status</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No bookings found for this date.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="font-medium text-slate-900 text-sm">
                        {booking.court}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell text-slate-600 text-sm">
                      {booking.start_time.slice(0, 5)} -{" "}
                      {booking.end_time.slice(0, 5)}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="text-slate-900 font-medium text-sm truncate max-w-[120px] sm:max-w-[200px]">
                        {booking.players.join(", ")}
                      </div>
                      <div className="text-slate-500 text-xs">
                        {booking.player_count} player(s)
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="font-medium text-slate-900 text-sm">
                        <AmountDisplay amount={booking.amount} />
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                      {booking.platform_commission ? (
                        <span className="text-amber-600 font-medium">
                          -<AmountDisplay amount={booking.platform_commission} />
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                      {booking.transaction_fee ? (
                        <span className="text-purple-600 font-medium">
                          -<AmountDisplay amount={booking.transaction_fee} />
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden xl:table-cell">
                      {booking.net_earnings ? (
                        <span className="text-emerald-600 font-bold">
                          <AmountDisplay amount={booking.net_earnings} />
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                      <PaymentTypeBadge type={booking.payment_type} />
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                      <Link href={`/dashboard/bookings/${booking.id}`}>
                        <Button variant={"primary"} size="sm">
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline ml-1">View</span>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && pagination.total_pages > 1 && (
        <div className="mt-4">
          <Pagination
            total={pagination.count}
            pageSize={pagination.page_size}
          />
        </div>
      )}
    </>
  );
}