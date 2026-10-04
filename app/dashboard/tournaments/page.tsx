// app/dashboard/tournaments/page.tsx

import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TournamentsTable from "./components/tournaments-table";
import {
  getTournamentsAction,
  getTournamentStatsAction,
} from "@/actions/manager-tournament.action";

export default async function TournamentsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const params = (await searchParams) || {};

  const queryParams = {
    status: params?.status as
      | "upcoming"
      | "ongoing"
      | "completed"
      | undefined,
    skill_category: params?.category,
    search: params?.search,
    page: params?.page ? parseInt(params.page) : undefined,
  };

  const [tournamentsRes, statsRes] = await Promise.all([
    getTournamentsAction(queryParams),
    getTournamentStatsAction(),
  ]);

  const tournaments = tournamentsRes.success ? tournamentsRes.data.results : [];
  const total = tournamentsRes.success ? tournamentsRes.data.count : 0;
  const stats = statsRes.success ? statsRes.data : null;
  const errorMessage = !tournamentsRes.success
    ? tournamentsRes.message
    : undefined;

  return (
    <div className="space-y-6 max-w-390 mx-auto pt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Tournaments</h1>
          <p className="text-sm text-slate-500">
            Manage ongoing, upcoming, and completed tournaments.
          </p>
        </div>
        <Link href="/dashboard/tournaments/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Tournament
          </Button>
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500">Total</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {stats?.total ?? 0}
          </p>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs font-medium text-blue-600">Upcoming</p>
          <p className="mt-1 text-2xl font-bold text-blue-700">
            {stats?.upcoming ?? 0}
          </p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-medium text-emerald-600">Ongoing</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">
            {stats?.ongoing ?? 0}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-500">Completed</p>
          <p className="mt-1 text-2xl font-bold text-slate-700">
            {stats?.completed ?? 0}
          </p>
        </div>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <Suspense fallback={null}>
        <TournamentsTable data={tournaments} total={total} />
      </Suspense>
    </div>
  );
}