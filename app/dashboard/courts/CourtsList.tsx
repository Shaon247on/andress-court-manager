// app/dashboard/courts/CourtsList.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MoreVertical,
  Eye,
  Pencil,
  Wrench,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  AlertCircle,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import SelectFilter from "@/components/common/SelectFilter";
import {
  updateCourtStatusAction,
  deleteCourtAction,
} from "@/actions/court-manager-court.action";
import type { CourtResult, CourtStats } from "@/types/CourtManagerCourt.type";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CourtsListProps {
  courts: CourtResult[];
  total: number;
  stats: CourtStats | null;
  errorMessage?: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    active: {
      label: "Active",
      className: "bg-green-100 text-green-700 border-green-200",
    },
    under_maintenance: {
      label: "Maintenance",
      className: "bg-orange-100 text-orange-700 border-orange-200",
    },
    closed: {
      label: "Closed",
      className: "bg-red-100 text-red-700 border-red-200",
    },
  };
  const { label, className } = statusMap[status] || statusMap.active;
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${className}`}
    >
      {label}
    </span>
  );
};

const CourtTypeBadge = ({ type }: { type: string }) => {
  const typeMap: Record<string, string> = {
    indoor: "bg-blue-100 text-blue-700",
    outdoor: "bg-emerald-100 text-emerald-700",
    both: "bg-purple-100 text-purple-700",
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${typeMap[type] || "bg-gray-100 text-gray-700"}`}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

const GameFormatBadge = ({ format }: { format: string }) => {
  return (
    <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
      {format}
    </span>
  );
};

const StatusOptions = [
  { label: "Active", value: "active" },
  { label: "Under Maintenance", value: "under_maintenance" },
];

const CourtTypeOptions = [
  { label: "Indoor", value: "indoor" },
  { label: "Outdoor", value: "outdoor" },
  // { label: "Both", value: "both" },
];

export default function CourtsList({
  courts = [],
  total = 0,
  stats = null,
  errorMessage,
}: CourtsListProps) {
  const router = useRouter();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState<CourtResult | null>(null);
  const [newStatus, setNewStatus] = useState<
    "active" | "under_maintenance" | "closed"
  >("active");
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async () => {
    if (!selectedCourt) return;
    setLoading(true);
    const res = await updateCourtStatusAction(selectedCourt.id, {
      status: newStatus,
    });
    if (res.success) {
      toast.success(res.data.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setLoading(false);
    setStatusDialogOpen(false);
    setSelectedCourt(null);
  };

  const handleDelete = async () => {
    if (!selectedCourt) return;
    setLoading(true);
    const res = await deleteCourtAction(selectedCourt.id);
    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setLoading(false);
    setDeleteDialogOpen(false);
    setSelectedCourt(null);
  };

  const openStatusDialog = (
    court: CourtResult,
    status: "active" | "under_maintenance" | "closed",
  ) => {
    setSelectedCourt(court);
    setNewStatus(status);
    setStatusDialogOpen(true);
  };

  const openDeleteDialog = (court: CourtResult) => {
    setSelectedCourt(court);
    setDeleteDialogOpen(true);
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
      <div className="mb-6 flex flex-col space-y-1 shrink-0">
        <h1 className="text-2xl font-bold text-slate-900">Court Management</h1>
        <p className="text-slate-500">Manage all courts and their details</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 shrink-0">
        <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6">
          <div className="text-sm font-medium text-slate-500 mb-1">
            Total Courts
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            {stats?.total ?? 0}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6">
          <div className="text-sm font-medium text-slate-500 mb-1">
            Available
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-green-600">
            {stats?.available ?? 0}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6">
          <div className="text-sm font-medium text-slate-500 mb-1">
            Under Maintenance
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-orange-500">
            {stats?.under_maintenance ?? 0}
          </div>
        </div>
        {/* <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6">
          <div className="text-sm font-medium text-slate-500 mb-1">Closed</div>
          <div className="text-2xl sm:text-3xl font-bold text-red-500">{stats?.closed ?? 0}</div>
        </div> */}
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 shrink-0">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-start sm:items-center w-full md:w-auto">
          <div className="w-full sm:w-64">
            <SearchInput name="search" placeholder="Search courts..." />
          </div>
          <div className="flex flex-wrap gap-2">
            <SelectFilter
              name="court_type"
              placeholder="All Types"
              options={CourtTypeOptions}
            />
            <SelectFilter
              name="status"
              placeholder="All Status"
              options={StatusOptions}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard/settings/schedule">
            <Button
              variant="outline"
              className="h-10 px-4 border-border text-sm font-medium"
            >
              <Settings2 className="w-4 h-4 mr-2" />
              Schedule Management
            </Button>
          </Link>
          
          <Link href="/dashboard/courts/new" className="w-full sm:w-auto">
            <Button variant="primary" className="h-10 w-full sm:w-auto">
              <span className="mr-2">+</span> Add Court
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 border-b border-slate-200">
              <TableRow>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Court
                </TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold hidden md:table-cell">
                  Type / Surface
                </TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold hidden lg:table-cell">
                  Formats
                </TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Status
                </TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold hidden sm:table-cell">
                  Price/hr
                </TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold hidden lg:table-cell">
                  Bookings
                </TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold hidden lg:table-cell">
                  Revenue
                </TableHead>
                <TableHead className="px-4 sm:px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No courts found.
                  </TableCell>
                </TableRow>
              ) : (
                courts.map((court) => (
                  <TableRow key={court.id} className="hover:bg-slate-50/50">
                    <TableCell className="px-4 sm:px-6 py-4">
                      <div>
                        <div className="font-bold text-slate-900 text-sm sm:text-base">
                          {court.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          Location: {court.location}
                        </div>
                        <div className="text-xs text-slate-500 sm:hidden mt-1">
                          <CourtTypeBadge type={court.court_type} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 hidden md:table-cell">
                      <div className="font-medium text-slate-900 capitalize">
                        {court.court_type}
                      </div>
                      <div className="text-slate-500 text-xs capitalize">
                        {court.surface}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {court.game_formats.map((format) => (
                          <GameFormatBadge key={format} format={format} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4">
                      <StatusBadge status={court.status} />
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <div className="font-bold text-slate-900">
                        €{court.price_per_hour}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 hidden lg:table-cell text-slate-900">
                      {court.bookings}
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 hidden lg:table-cell font-bold text-green-600">
                      €{parseFloat(court.revenue).toLocaleString()}
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/dashboard/courts/${court.id}`)
                            }
                          >
                            <Eye className="w-4 h-4 mr-2 text-slate-500" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/dashboard/courts/${court.id}/edit`)
                            }
                          >
                            <Pencil className="w-4 h-4 mr-2 text-slate-500" />
                            Edit
                          </DropdownMenuItem>
                          {court.status !== "active" && (
                            <DropdownMenuItem
                              onClick={() => openStatusDialog(court, "active")}
                              className="text-green-600 focus:text-green-700"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Set Active
                            </DropdownMenuItem>
                          )}
                          {court.status !== "under_maintenance" && (
                            <DropdownMenuItem
                              onClick={() =>
                                openStatusDialog(court, "under_maintenance")
                              }
                              className="text-orange-600 focus:text-orange-700"
                            >
                              <Wrench className="w-4 h-4 mr-2" />
                              Set Maintenance
                            </DropdownMenuItem>
                          )}
                          {/* {court.status !== 'closed' && (
                            <DropdownMenuItem
                              onClick={() => openStatusDialog(court, 'closed')}
                              className="text-red-600 focus:text-red-700"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Set Closed
                            </DropdownMenuItem>
                          )} */}
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(court)}
                            className="text-red-600 focus:text-red-700 border-t border-slate-100 mt-1 pt-1"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Delete Court
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
        {total > 0 && (
          <div className="px-4 sm:px-6 py-4 border-t border-slate-200">
            <Pagination total={total} pageSize={10} />
          </div>
        )}
      </div>

      {/* Status Change Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Court Status</DialogTitle>
            <DialogDescription>
              Change the status of{" "}
              <span className="font-semibold">{selectedCourt?.name}</span> to{" "}
              <span className="font-semibold capitalize">
                {newStatus === "active"
                  ? "Active"
                  : newStatus === "under_maintenance"
                    ? "Under Maintenance"
                    : "Closed"}
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStatusDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleStatusChange}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Court</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedCourt?.name}</span>? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Delete Court
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
