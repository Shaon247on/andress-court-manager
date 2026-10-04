import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  getTournamentDetailsAction,
  getTournamentTeamDetailsAction,
} from "@/actions/manager-tournament.action";
import TeamRoster from "./components/team-roster";

interface TeamDetailPageProps {
  params: Promise<{ tournamentId: string; teamId: string }>;
}

export default async function TeamDetailPage({ params }: TeamDetailPageProps) {
  const { teamId } = await params;
  const teamResult = await getTournamentTeamDetailsAction(teamId);
  if (!teamResult.success) notFound();
  const team = teamResult.data.team;
  const rosterKey = team.slots.map((slot) => `${slot.id}:${slot.updated_at}`).join("|");
  const tournamentResult = await getTournamentDetailsAction(team.tournament);
  const tournamentName = tournamentResult.success ? tournamentResult.data.name : "Tournament";

  return (
    <div className="space-y-6">
      <Link
        href={`/dashboard/tournaments/${team.tournament}`}
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to tournament
      </Link>

      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">{team.name}</h2>
          <p className="text-sm text-slate-500">{tournamentName}</p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-y border-slate-200 py-4 text-sm sm:grid-cols-4">
        <div><dt className="text-xs text-slate-500">Group / seed</dt><dd className="mt-1 font-medium text-slate-800">{team.group ?? "-"} / {team.seed}</dd></div>
        <div><dt className="text-xs text-slate-500">Record</dt><dd className="mt-1 font-medium text-slate-800">{team.game_played} GP · {team.win} W · {team.draw} D · {team.lose} L</dd></div>
        <div><dt className="text-xs text-slate-500">Points</dt><dd className="mt-1 font-medium text-slate-800">{team.points}</dd></div>
        <div><dt className="text-xs text-slate-500">Captain / status</dt><dd className="mt-1 font-medium text-slate-800">{team.captain_name ?? "No captain"} · {team.status}</dd></div>
      </dl>

      <TeamRoster key={`${team.id}:${rosterKey}`} initialTeam={team} />
    </div>
  );
}
