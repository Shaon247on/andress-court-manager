// app/dashboard/tournaments/components/tournaments-table.tsx

"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { Tournament, TournamentStatus, TournamentCategory } from "../lib/types";
import { formatCategory, CURRENCY_SYMBOLS } from "../lib/rules";
import { cn } from "@/lib/utils";
import SearchInput from "@/components/common/SearchInput";
import SelectFilter from "@/components/common/SelectFilter";
import Pagination from "@/components/common/Pagination";

const PAGE_SIZE = 10;

const statusStyles: Record<TournamentStatus, string> = {
  upcoming: "bg-blue-50 text-blue-700 border-blue-200",
  ongoing: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
};

// ── 9-level category options ──
const CATEGORY_OPTIONS: { label: string; value: TournamentCategory }[] = [
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
  data: Tournament[];
}

export default function TournamentsTable({ data }: TournamentsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = (searchParams.get("search") ?? "").toLowerCase();
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1", 10) || 1;

  const filtered = data.filter((t) => {
    const matchesSearch = search ? t.name.toLowerCase().includes(search) : true;
    const matchesCategory = category ? t.category === category : true;
    const matchesStatus = status ? t.status === status : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const start = (page - 1) * PAGE_SIZE;
  const paginated = filtered.slice(start, start + PAGE_SIZE);

  const goToTournament = (id: string) => {
    router.push(`/dashboard/tournaments/${id}`);
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
            {paginated.map((t) => {
              const currencySymbol = CURRENCY_SYMBOLS[t.currency] ?? "$";

              return (
                <tr
                  key={t.id}
                  onClick={() => goToTournament(t.id)}
                  className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{t.name}</p>
                    <p className="line-clamp-1 text-xs text-slate-500">
                      {t.shortDescription}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatCategory(t.category)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{t.teamType}</td>
                  <td className="px-4 py-3 text-slate-600">{t.teamCount}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {t.format === "group" ? "Group + Knockout" : "Knockout only"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {currencySymbol}
                    {t.entryFeePerPlayer} / player
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={cn("capitalize", statusStyles[t.status])}
                    >
                      {t.status}
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
                        <DropdownMenuItem
                          onClick={() => goToTournament(t.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/dashboard/tournaments/${t.id}/edit`)
                          }
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}

            {paginated.length === 0 && (
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

      <Pagination total={filtered.length} pageSize={PAGE_SIZE} />
    </div>
  );
}