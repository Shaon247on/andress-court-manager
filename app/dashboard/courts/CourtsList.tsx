"use client";

import React, { useState, useMemo } from "react";
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
  Settings2,
  ChevronRight,
  Merge,
  History,
  Layers,
  MapPin,
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
import { motion, AnimatePresence } from "motion/react";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import SelectFilter from "@/components/common/SelectFilter";
import { MergeCourtDialog } from "./MergeCourtDialog";
import {
  updateCourtStatusAction,
  deleteCourtAction,
  deleteMergedCourtAction,
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

// ── Status Badge ──
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
    merged: {
      label: "Merged",
      className: "bg-purple-100 text-purple-700 border-purple-200",
    },
    upcoming: {
      label: "Upcoming",
      className: "bg-blue-100 text-blue-700 border-blue-200",
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

// ── Court Type Badge ──
const CourtTypeBadge = ({ type }: { type: string }) => {
  const typeMap: Record<string, string> = {
    indoor: "bg-blue-100 text-blue-700",
    outdoor: "bg-emerald-100 text-emerald-700",
    both: "bg-purple-100 text-purple-700",
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
        typeMap[type] || "bg-gray-100 text-gray-700"
      }`}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

// ── Game Format Badge ──
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
  { label: "Merged", value: "merged" },
];

const CourtTypeOptions = [
  { label: "Indoor", value: "indoor" },
  { label: "Outdoor", value: "outdoor" },
];

export default function CourtsList({
  courts = [],
  total = 0,
  stats = null,
  errorMessage,
}: CourtsListProps) {
  const router = useRouter();

  // ── Dialog states ──
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState<CourtResult | null>(null);
  const [newStatus, setNewStatus] = useState<
    "active" | "under_maintenance" | "closed"
  >("active");
  const [loading, setLoading] = useState(false);
  const [expandedMergedIds, setExpandedMergedIds] = useState<Set<string>>(
    new Set(),
  );

  // ── Build a map of courts by id for quick lookup ──
  const courtsById = useMemo(() => {
    const map = new Map<string, CourtResult>();
    courts.forEach((court) => map.set(court.id, court));
    return map;
  }, [courts]);

  // ── Get matched child courts for a merged court ──
  const getMergedChildCourts = (court: CourtResult): CourtResult[] => {
    if (!court.merged_court_ids || court.merged_court_ids.length === 0) {
      return [];
    }
    return court.merged_court_ids
      .map((id) => courtsById.get(id))
      .filter((c): c is CourtResult => c !== undefined);
  };

  // ── Check if a court row should be expandable ──
  // A court is expandable if: is_merged === true AND status === 'active'
  const isMergedActive = (court: CourtResult) => {
    return court.is_merged === true && court.status === "active";
  };

  // ── Toggle expanded row ──
  const toggleMergedExpand = (id: string) => {
    setExpandedMergedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Status change handler ──
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

  // ── Delete handler (regular courts) ──
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

  // ── Delete handler (merged courts) ──
  const handleMergedDelete = async () => {
    if (!selectedCourt) return;
    setLoading(true);
    const res = await deleteMergedCourtAction(selectedCourt.id);
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

  // ── Open status dialog ──
  const openStatusDialog = (
    court: CourtResult,
    status: "active" | "under_maintenance" | "closed",
  ) => {
    setSelectedCourt(court);
    setNewStatus(status);
    setStatusDialogOpen(true);
  };

  // ── Open delete dialog ──
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
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/courts/merged">
            <Button
              variant="outline"
              className="h-10 px-4 border-border text-sm font-medium"
            >
              <History className="w-4 h-4 mr-2" />
              Merge History
            </Button>
          </Link>
          <Button
            variant="outline"
            className="h-10 px-4 border-border text-sm font-medium"
            onClick={() => setMergeDialogOpen(true)}
          >
            <Merge className="w-4 h-4 mr-2" />
            Merge Courts
          </Button>
          <Link href="/dashboard/settings/schedule">
            <Button
              variant="outline"
              className="h-10 px-4 border-border text-sm font-medium"
            >
              <Settings2 className="w-4 h-4 mr-2" />
              Schedule
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
                <TableHead className="w-8" />
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
                    colSpan={9}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No courts found.
                  </TableCell>
                </TableRow>
              ) : (
                courts.map((court) => {
                  const canExpand = isMergedActive(court);
                  const isExpanded = expandedMergedIds.has(court.id);
                  const childCourts = canExpand
                    ? getMergedChildCourts(court)
                    : [];

                  return (
                    <React.Fragment key={court.id}>
                      {/* Main Row */}
                      <TableRow
                        className={cn(
                          "transition-colors",
                          canExpand
                            ? "cursor-pointer bg-purple-50/30 hover:bg-purple-50/60"
                            : "hover:bg-slate-50/50",
                        )}
                        onClick={
                          canExpand
                            ? () => toggleMergedExpand(court.id)
                            : undefined
                        }
                      >
                        {/* Expand indicator */}
                        <TableCell className="w-8 pl-4">
                          {canExpand && (
                            <motion.button
                              type="button"
                              className="text-purple-500 hover:text-purple-700 flex items-center justify-center w-6 h-6 rounded-md hover:bg-purple-100 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMergedExpand(court.id);
                              }}
                              animate={{ rotate: isExpanded ? 90 : 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </motion.button>
                          )}
                        </TableCell>

                        {/* Court Name */}
                        <TableCell className="px-4 sm:px-6 py-4">
                          <div>
                            <div className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2 flex-wrap">
                              {court.name}
                              {court.is_merged && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                                  <Layers className="w-3 h-3" />
                                  MERGED
                                </span>
                              )}
                              {canExpand && childCourts.length > 0 && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white text-purple-700 border border-purple-200">
                                  {childCourts.length} courts
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500">
                              Location: {court.location}
                            </div>
                            <div className="text-xs text-slate-500 sm:hidden mt-1">
                              <CourtTypeBadge type={court.court_type} />
                            </div>
                          </div>
                        </TableCell>

                        {/* Type / Surface */}
                        <TableCell className="px-4 sm:px-6 py-4 hidden md:table-cell">
                          <div className="font-medium text-slate-900 capitalize">
                            {court.court_type}
                          </div>
                          <div className="text-slate-500 text-xs capitalize">
                            {court.surface}
                          </div>
                        </TableCell>

                        {/* Formats */}
                        <TableCell className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {court.game_formats.map((format) => (
                              <GameFormatBadge key={format} format={format} />
                            ))}
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="px-4 sm:px-6 py-4">
                          <StatusBadge status={court.status} />
                        </TableCell>

                        {/* Price */}
                        <TableCell className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                          <div className="font-bold text-slate-900">
                            €{court.price_per_hour}
                          </div>
                        </TableCell>

                        {/* Bookings */}
                        <TableCell className="px-4 sm:px-6 py-4 hidden lg:table-cell text-slate-900">
                          {court.bookings}
                        </TableCell>

                        {/* Revenue */}
                        <TableCell className="px-4 sm:px-6 py-4 hidden lg:table-cell font-bold text-green-600">
                          €{parseFloat(court.revenue).toLocaleString()}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="px-4 sm:px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="w-5 h-5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              {court.is_merged ? (
                                <>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(
                                        `/dashboard/courts/marged/${court.id}`,
                                      );
                                    }}
                                  >
                                    <Eye className="w-4 h-4 mr-2 text-slate-500" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(
                                        `/dashboard/courts/marged/${court.id}/edit`,
                                      );
                                    }}
                                  >
                                    <Pencil className="w-4 h-4 mr-2 text-slate-500" />
                                    Edit Merge
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openDeleteDialog(court);
                                    }}
                                    className="text-red-600 focus:text-red-700 border-t border-slate-100 mt-1 pt-1"
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Cancel Merge
                                  </DropdownMenuItem>
                                </>
                              ) : (
                                <>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(
                                        `/dashboard/courts/${court.id}`,
                                      );
                                    }}
                                  >
                                    <Eye className="w-4 h-4 mr-2 text-slate-500" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(
                                        `/dashboard/courts/${court.id}/edit`,
                                      );
                                    }}
                                  >
                                    <Pencil className="w-4 h-4 mr-2 text-slate-500" />
                                    Edit
                                  </DropdownMenuItem>
                                  {court.status !== "active" &&
                                    court.status !== "merged" && (
                                      <DropdownMenuItem
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openStatusDialog(court, "active");
                                        }}
                                        className="text-green-600 focus:text-green-700"
                                      >
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Set Active
                                      </DropdownMenuItem>
                                    )}
                                  {court.status !== "under_maintenance" && (
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openStatusDialog(
                                          court,
                                          "under_maintenance",
                                        );
                                      }}
                                      className="text-orange-600 focus:text-orange-700"
                                    >
                                      <Wrench className="w-4 h-4 mr-2" />
                                      Set Maintenance
                                    </DropdownMenuItem>
                                  )}
                                  {court.status !== "merged" && (
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openDeleteDialog(court);
                                      }}
                                      className="text-red-600 focus:text-red-700 border-t border-slate-100 mt-1 pt-1"
                                    >
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Delete Court
                                    </DropdownMenuItem>
                                  )}
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>

                      {/* ── Expanded Row: Show child courts with full column data ── */}
                      <AnimatePresence>
                        {canExpand && isExpanded && (
                          <TableRow className="bg-transparent hover:bg-transparent">
                            <TableCell colSpan={9} className="p-0 border-0">
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: 0.3,
                                  ease: [0.4, 0, 0.2, 1],
                                }}
                                className="overflow-hidden"
                              >
                                <div className="bg-gradient-to-br from-purple-50 to-white px-4 sm:px-6 py-5 border-y border-purple-100">
                                  {/* Section Header */}
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100">
                                      <Layers className="w-3.5 h-3.5 text-purple-600" />
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-bold text-slate-900">
                                        Courts in this Merge
                                      </h4>
                                      <p className="text-xs text-slate-500">
                                        {childCourts.length}{" "}
                                        {childCourts.length === 1
                                          ? "court"
                                          : "courts"}{" "}
                                        combined to form {court.name}
                                      </p>
                                    </div>
                                  </div>

                                  {childCourts.length > 0 ? (
                                    <div className="space-y-2">
                                      {childCourts.map((childCourt, idx) => (
                                        <motion.div
                                          key={childCourt.id}
                                          initial={{ opacity: 0, x: -8 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{
                                            delay: 0.08 * idx,
                                            duration: 0.25,
                                          }}
                                          className="rounded-lg border border-slate-200 bg-white overflow-hidden hover:border-purple-300 hover:shadow-sm transition-all"
                                        >
                                          {/* Child Court Row with full column data */}
                                          <div className="grid grid-cols-12 gap-3 items-center px-4 py-3">
                                            {/* Index + Name */}
                                            <div className="col-span-12 sm:col-span-4 flex items-center gap-3">
                                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-xs font-bold text-purple-700">
                                                {idx + 1}
                                              </div>
                                              <div className="min-w-0">
                                                <p className="font-semibold text-slate-900 text-sm truncate">
                                                  {childCourt.name}
                                                </p>
                                                <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                                                  <MapPin className="w-3 h-3" />
                                                  {childCourt.location}
                                                </p>
                                              </div>
                                            </div>

                                            {/* Type / Surface */}
                                            <div className="col-span-6 sm:col-span-2">
                                              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
                                                Type
                                              </p>
                                              <p className="text-xs font-medium text-slate-700 capitalize">
                                                {childCourt.court_type}
                                              </p>
                                              <p className="text-[10px] text-slate-500 capitalize">
                                                {childCourt.surface}
                                              </p>
                                            </div>

                                            {/* Formats */}
                                            <div className="col-span-6 sm:col-span-2">
                                              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                                                Formats
                                              </p>
                                              <div className="flex flex-wrap gap-0.5">
                                                {childCourt.game_formats
                                                  .slice(0, 3)
                                                  .map((format) => (
                                                    <span
                                                      key={format}
                                                      className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700"
                                                    >
                                                      {format}
                                                    </span>
                                                  ))}
                                                {childCourt.game_formats
                                                  .length > 3 && (
                                                  <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                                                    +
                                                    {childCourt.game_formats
                                                      .length - 3}
                                                  </span>
                                                )}
                                              </div>
                                            </div>

                                            {/* Status */}
                                            <div className="col-span-6 sm:col-span-1">
                                              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                                                Status
                                              </p>
                                              <StatusBadge
                                                status={childCourt.status}
                                              />
                                            </div>

                                            {/* Price */}
                                            <div className="col-span-6 sm:col-span-1">
                                              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
                                                Price
                                              </p>
                                              <p className="text-xs font-bold text-slate-900">
                                                €{childCourt.price_per_hour}
                                              </p>
                                            </div>

                                            {/* Bookings */}
                                            <div className="col-span-6 sm:col-span-1">
                                              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
                                                Bookings
                                              </p>
                                              <p className="text-xs font-medium text-slate-700">
                                                {childCourt.bookings}
                                              </p>
                                            </div>

                                            {/* Revenue */}
                                            <div className="col-span-6 sm:col-span-1">
                                              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
                                                Revenue
                                              </p>
                                              <p className="text-xs font-bold text-green-600">
                                                €
                                                {parseFloat(
                                                  childCourt.revenue,
                                                ).toLocaleString()}
                                              </p>
                                            </div>
                                          </div>
                                        </motion.div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-6 text-center">
                                      <p className="text-sm text-slate-500">
                                        No matching courts found. The merged
                                        courts may have been deleted or are not
                                        in the current list.
                                      </p>
                                    </div>
                                  )}

                                  {/* Quick Actions */}
                                  <div className="mt-4 flex items-center justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 text-xs"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(
                                          `/dashboard/courts/marged/${court.id}`,
                                        );
                                      }}
                                    >
                                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                                      View Full Details
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 text-xs"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(
                                          `/dashboard/courts/marged/${court.id}/edit`,
                                        );
                                      }}
                                    >
                                      <Pencil className="w-3.5 h-3.5 mr-1.5" />
                                      Edit Merge
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            </TableCell>
                          </TableRow>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })
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

      {/* Merge Dialog */}
      <MergeCourtDialog
        open={mergeDialogOpen}
        onOpenChange={setMergeDialogOpen}
      />

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

      {/* Delete / Cancel Merge Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCourt?.is_merged ? "Cancel Merge" : "Delete Court"}
            </DialogTitle>
            <DialogDescription>
              {selectedCourt?.is_merged ? (
                <>
                  Are you sure you want to cancel the merge for{" "}
                  <span className="font-semibold">{selectedCourt?.name}</span>?
                  This action cannot be undone.
                </>
              ) : (
                <>
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">{selectedCourt?.name}</span>?
                  This action cannot be undone.
                </>
              )}
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
            <Button
              variant="danger"
              onClick={
                selectedCourt?.is_merged ? handleMergedDelete : handleDelete
              }
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {selectedCourt?.is_merged ? "Cancel Merge" : "Delete Court"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
