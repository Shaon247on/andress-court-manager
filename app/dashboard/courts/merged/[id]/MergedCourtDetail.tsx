// app/dashboard/courts/marged/[id]/MergedCourtDetail.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Layers,
  Calendar,
  Clock,
  MapPin,
  Euro,
  Pencil,
  XCircle,
  Loader2,
  Users,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { deleteMergedCourtAction } from "@/actions/court-manager-court.action";
import type { MergedCourt } from "@/types/CourtManagerCourt.type";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface MergedCourtDetailProps {
  data: MergedCourt;
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
      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${className}`}
    >
      {label}
    </span>
  );
};

export default function MergedCourtDetail({ data }: MergedCourtDetailProps) {
  const router = useRouter();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancelMerge = async () => {
    setLoading(true);
    const res = await deleteMergedCourtAction(data.id);
    if (res.success) {
      toast.success(res.message);
      router.push("/dashboard/courts/");
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setLoading(false);
    setCancelDialogOpen(false);
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy • h:mm a");
    } catch {
      return dateString;
    }
  };

  const isCancellable =
    data.current_status !== "cancelled" && data.status !== "cancelled";

  return (
    <>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/courts/"
              className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {data.name}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Merged Court Session
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={data.current_status || data.status} />
            {isCancellable && (
              <>
                <Link href={`/dashboard/courts/marged/${data.id}/edit`}>
                  <Button variant="outline" size="sm" className="h-9">
                    <Pencil className="w-3.5 h-3.5 mr-1.5" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  className="h-9"
                  onClick={() => setCancelDialogOpen(true)}
                >
                  <XCircle className="w-3.5 h-3.5 mr-1.5" />
                  Cancel Merge
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Hero Card */}
        <Card className="border-none shadow-sm rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Layers className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-100">
                  Merged Courts
                </p>
                <p className="text-3xl font-bold mt-0.5">
                  {data.courts.length} Courts
                </p>
                <p className="text-sm text-purple-100/80 mt-1 capitalize">
                  {data.court_type} • {data.sport} • {data.surface}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
              <Euro className="w-5 h-5 text-purple-200" />
              <div>
                <p className="text-xs text-purple-200">Price per Hour</p>
                <p className="text-lg font-bold">
                  €{parseFloat(data.price_per_hour).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Court Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Merged Courts */}
            <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white p-4 sm:p-6">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4 text-purple-500" />
                Courts in this Merge
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.courts.map((court, idx) => (
                  <div
                    key={court.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-sm font-bold text-purple-700">
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 truncate">
                        {court.name}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">
                        {court.court_type} • {court.game_format}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Game Formats */}
            <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white p-4 sm:p-6">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Trophy className="w-4 h-4 text-emerald-500" />
                Game Formats
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.game_formats.map((format) => (
                  <span
                    key={format}
                    className="inline-flex px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                  >
                    {format}
                  </span>
                ))}
              </div>
            </Card>

            {/* Location */}
            <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white p-4 sm:p-6">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-blue-500" />
                Location
              </h2>
              <p className="text-sm text-slate-700">{data.location}</p>
            </Card>
          </div>

          {/* Timing Info */}
          <div className="space-y-6">
            <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white p-4 sm:p-6">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-emerald-500" />
                Session Details
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">
                    Start Time
                  </p>
                  <div className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    {formatDateTime(data.start_time)}
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-500 font-medium mb-1">
                    End Time
                  </p>
                  <div className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                    <Clock className="w-4 h-4 text-red-500" />
                    {formatDateTime(data.end_time)}
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-500 font-medium mb-1">
                    Created
                  </p>
                  <p className="text-sm text-slate-700">
                    {formatDateTime(data.created_at)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Cancel Merge Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Merged Court</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel the merge for{" "}
              <span className="font-semibold">{data.name}</span>? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={loading}
            >
              Keep Merge
            </Button>
            <Button
              variant="danger"
              onClick={handleCancelMerge}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Cancel Merge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}