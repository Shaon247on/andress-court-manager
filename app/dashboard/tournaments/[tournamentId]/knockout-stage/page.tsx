import { notFound } from "next/navigation";
import {
  mockTournaments,
  mockKnockoutByTournament,
  mockTeamsByTournament,
} from "@/app/dashboard/tournaments/lib/mock-data";
import Bracket from "./components/bracket";

interface KnockoutStagePageProps {
  params: { tournamentId: string };
}

export default function KnockoutStagePage({ params }: KnockoutStagePageProps) {
  const tournament = mockTournaments.find((t) => t.id === params.tournamentId);
  if (!tournament) notFound();

  const matches = mockKnockoutByTournament[tournament.id] ?? [];
  const teams = mockTeamsByTournament[tournament.id] ?? [];
  const teamsById = Object.fromEntries(teams.map((t) => [t.id, t]));

  return (
    <div className="space-y-4 max-w-390 mx-auto">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">Knockout Bracket</h2>
        <p className="text-sm text-slate-500">
          {tournament.hasGroupStage
            ? "Group winners advance here once the group stage completes."
            : "Direct knockout — no group stage for this tournament."}
        </p>
      </div>

      {matches.length > 0 ? (
        <Bracket matches={matches} teamsById={teamsById} />
      ) : (
        <p className="rounded-lg border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
          Bracket not generated yet.
        </p>
      )}
    </div>
  );
}