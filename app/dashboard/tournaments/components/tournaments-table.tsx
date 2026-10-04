// app/dashboard/tournaments/components/tournaments-table.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Eye, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TournamentAPI } from "../lib/tournament.types";
import { TournamentFormInput } from "../lib/tournamment.schema";
import { cn } from "@/lib/utils";
import SearchInput from "@/components/common/SearchInput";
import SelectFilter from "@/components/common/SelectFilter";
import Pagination from "@/components/common/Pagination";
import { TournamentForm } from "./tournament-form";
import {
  deleteTournamentAction,
  updateTournamentAction,
} from "@/actions/manager-tournament.action";
import { toast } from "sonner";

const PAGE_SIZE = 10;

const statusStyles: Record<string, string> = {
  upcoming: "bg-blue-50 text-blue-700 border-blue-200",
  ongoing: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
};

const CATEGORY_OPTIONS = [
  { label: "Low Beginner", value: "low_beginner" },
  { label: "Medium Beginner", value: "medium_beginner" },
  { label: "High Beginner", value: "high_beginner" },
  { label: "Low Intermediate", value: "low_intermediate" },
  { label: "Medium Intermediate", value: "medium_intermediate" },
  { label: "High Intermediate", value: "high_intermediate" },
  { label: "Low Advanced", value: "low_advanced" },
  { label: "Medium Advanced", value: "medium_advanced" },
  { label: "High Advanced", value: "high_advanced" },
];

interface TournamentsTableProps {
  data: TournamentAPI[];
  total: number;
}

export default function TournamentsTable({
  data,
  total,
}: TournamentsTableProps) {
  const router = useRouter();

  const [editing, setEditing] = useState<TournamentAPI | null>(null);
  const [deleting, setDeleting] = useState<TournamentAPI | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const goToTournament = (id: string) => {
    router.push(`/dashboard/tournaments/${id}`);
  };

  // ── Edit submit ──
  const handleEditSubmit = async (values: TournamentFormInput) => {
    if (!editing) return { success: false, message: "No tournament selected" };

    const res = await updateTournamentAction(editing.id, values);
    if (res.success) {
      toast.success("Tournament updated", { description: values.name });
      setEditing(null);
      router.refresh();
      return { success: true };
    }
    return { success: false, message: res.message };
  };

  // ── Delete ──
  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    const res = await deleteTournamentAction(deleting.id);
    if (res.success) {
      toast.success(res.data.message);
      setDeleting(null);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setDeleteLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:max-w-xs">
          <SearchInput name="search" placeholder="Search tournaments..." />
        </div>
        <SelectFilter
          name="category"
          placeholder="Category"
          clearLabel="All categories"
          options={CATEGORY_OPTIONS}
        />
        <SelectFilter
          name="status"
          placeholder="Status"
          clearLabel="All statuses"
          options={[
            { label: "Upcoming", value: "upcoming" },
            { label: "Ongoing", value: "ongoing" },
            { label: "Completed", value: "completed" },
          ]}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Tournament</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Team type</th>
              <th className="px-4 py-3">Teams</th>
              <th className="px-4 py-3">Format</th>
              <th className="px-4 py-3">Entry fee</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((t) => {
              const currencySymbol = "€";

              return (
                <tr
                  key={t.id}
                  onClick={() => goToTournament(t.id)}
                  className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{t.name}</p>
                    <p className="line-clamp-1 text-xs text-slate-500">
                      {t.short_description || "No description"}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {t.skill_category_display}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{t.team_type}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {t.number_of_teams}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {t.format_display}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {currencySymbol}
                    {parseFloat(t.entry_fee_per_player)} / player
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={cn("capitalize", statusStyles[t.status])}
                    >
                      {t.status_display}
                    </Badge>
                  </td>
                  <td
                    className="px-4 py-3 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          aria-label="Open actions"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => goToTournament(t.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditing(t)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleting(t)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-sm text-slate-500"
                >
                  No tournaments match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination total={total} pageSize={PAGE_SIZE} />

      {/* ── Edit Dialog ── */}
      <Dialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent className="md:min-w-2xl lg:min-w-3xl max-h-[90vh] overflow-y-auto p-0">
          {editing && (
            <TournamentForm
              mode="edit"
              initialValues={{
                name: editing.name,
                format: editing.format,
                skill_category: editing.skill_category,
                team_type: editing.team_type as any,
                number_of_teams: editing.number_of_teams,
                currency: editing.currency as any,
                entry_fee_per_player: parseFloat(editing.entry_fee_per_player),
                short_description: editing.short_description,
                rules: editing.rules,
                start_date: editing.start_date,
                end_date: editing.end_date,
              }}
              onSubmitAction={handleEditSubmit}
              onCancel={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ── Delete Dialog ── */}
      <Dialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tournament</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deleting?.name}</span>? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleting(null)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
