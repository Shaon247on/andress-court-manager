import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TournamentsTable from "./components/tournaments-table";
import { mockTournaments } from "./lib/mock-data";

export default function TournamentsPage() {
  return (
    <div className="space-y-6 max-w-390 mx-auto pt-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Tournaments</h1>
          <p className="text-sm text-slate-500">
            Manage ongoing, upcoming, and completed tournaments.
          </p>
        </div>
        <Link href="/dashboard/tournaments/create">
          <Button asChild className="gap-2">
            <Plus className="h-4 w-4" />
            Add Tournament
          </Button>
        </Link>
      </div>

      <Suspense fallback={null}>
        <TournamentsTable data={mockTournaments} />
      </Suspense>
    </div>
  );
}
