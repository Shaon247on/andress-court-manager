"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  Layers,
  Calendar,
  Clock,
  MapPin,
  Euro,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import SelectFilter from "@/components/common/SelectFilter";
import type { MergedCourtsResponse } from "@/types/CourtManagerCourt.type";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface MergedCourtsListProps {
  data: MergedCourtsResponse | null;
  errorMessage?: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    upcoming: {
      label: "Upcoming",
      className: "bg-blue-100 text-blue-700 border-blue-200",
    },
    active: {
      label: "Active",
      className: "bg-green-100 text-green-700 border-green-200",
    },
    merged: {
      label: "Merged",
      className: "bg-purple-100 text-purple-700 border-purple-200",
    },
    completed: {
      label: "Completed",
      className: "bg-slate-100 text-slate-700 border-slate-200",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-red-100 text-red-700 border-red-200",
    },
  };
  const { label, className } = statusMap[status] || statusMap.upcoming;
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}
    >
      {label}
    </span>
  );
};

const StatusOptions = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Active", value: "active" },
  { label: "Merged", value: "merged" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function MergedCourtsList({
  data,
  errorMessage,
}: MergedCourtsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    params.delete("page");
    router.push(`/dashboard/courts/merged?${params.toString()}`);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy • h:mm a");
    } catch {
      return dateString;
    }
  };

  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {errorMessage}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3 shrink-0">
        <Link
          href="/dashboard/courts"
          className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Merged Courts</h1>
          <p className="text-slate-500">
            View and manage all merged court sessions
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 shrink-0">
        <div className="flex-1 w-full">
          <SearchInput name="q" placeholder="Search by name or code..." />
        </div>
        <div className="w-full sm:w-auto">
          <SelectFilter
            name="status"
            placeholder="All Status"
            options={StatusOptions}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 border-b border-slate-200">
              <TableRow>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Merged Court
                </TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold hidden md:table-cell">
                  Courts
                </TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold hidden lg:table-cell">
                  Duration
                </TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Status
                </TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold hidden sm:table-cell">
                  Price/hr
                </TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.results.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No merged courts found.
                  </TableCell>
                </TableRow>
              ) : (
                data.results.map((merged) => (
                  <TableRow
                    key={merged.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                          <Layers className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {merged.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {merged.court_type} • {merged.sport}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {merged.courts.slice(0, 3).map((court) => (
                          <span
                            key={court.id}
                            className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700"
                          >
                            {court.name}
                          </span>
                        ))}
                        {merged.courts.length > 3 && (
                          <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500">
                            +{merged.courts.length - 3} more
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                      <div className="text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(merged.start_time)}
                        </div>
                        <div className="flex items-center gap-1 text-slate-500 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {formatDateTime(merged.start_time).split("•")[1]} -{" "}
                          {formatDateTime(merged.end_time).split("•")[1]}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4">
                      <StatusBadge status={merged.current_status || merged.status} />
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <div className="font-bold text-slate-900">
                        €{parseFloat(merged.price_per_hour).toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-xs"
                        onClick={() =>
                          router.push(`/dashboard/courts/merged/${merged.id}`)
                        }
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {data.count > 0 && (
          <div className="px-4 sm:px-6 py-4 border-t border-slate-200">
            <Pagination total={data.count} pageSize={20} />
          </div>
        )}
      </div>
    </>
  );
}