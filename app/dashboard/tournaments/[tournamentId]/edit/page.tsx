// app/dashboard/tournaments/[tournamentId]/edit/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { mockTournaments } from "../../lib/mock-data";
import EditTournamentForm from "./components/edit-form";

interface EditTournamentPageProps {
  params: Promise<{ tournamentId: string }>;
}

export default async function EditTournamentPage({
  params,
}: EditTournamentPageProps) {
  const { tournamentId } = await params;

  const tournament = mockTournaments.find((t) => t.id === tournamentId);
  if (!tournament) notFound();

  const initialValues = {
    name: tournament.name,
    shortDescription: tournament.shortDescription,
    rulesAndRegulations: tournament.rulesAndRegulations,   // ← now on the type
    format: tournament.format,                              // ← changed from hasGroupStage
    category: tournament.category,
    teamType: tournament.teamType,
    teamCount: tournament.teamCount,
    entryFeePerPlayer: tournament.entryFeePerPlayer,        // ← changed from entryFeePerTeam
    currency: tournament.currency,                          // ← now on the type
  };

  return (
    <div className="mx-auto max-w-390 space-y-6 pt-8">
      <Link
        href="/dashboard/tournaments"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to tournaments
      </Link>
      <EditTournamentForm
        tournamentId={tournament.id}
        initialValues={initialValues}
      />
    </div>
  );
}