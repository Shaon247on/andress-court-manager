import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  mockTournaments,
  mockTeamsByTournament,
  mockRosterByTeam,
  mockAvailablePlayers,
} from "@/app/dashboard/tournaments/lib/mock-data";
import { getSlotsPerTeam } from "@/app/dashboard/tournaments/lib/rules";
import TeamRoster from "./components/team-roster";

interface TeamDetailPageProps {
  params: { tournamentId: string; teamId: string };
}

export default function TeamDetailPage({ params }: TeamDetailPageProps) {
  const tournament = mockTournaments.find((t) => t.id === params.tournamentId);
  const teams = mockTeamsByTournament[params.tournamentId] ?? [];
  const team = teams.find((t) => t.id === params.teamId);

  if (!tournament || !team) notFound();

  const totalSlots = getSlotsPerTeam(tournament.teamType);
  const roster = mockRosterByTeam[team.id] ?? [];

  return (
    <div className="space-y-6">
      <Link
        href={`/dashboard/tournaments/${tournament.id}`}
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to tournament
      </Link>

      <div className="flex items-center gap-3">
        <span className="text-3xl leading-none">{team.flag}</span>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">{team.name}</h2>
          <p className="text-sm text-slate-500">{tournament.name}</p>
        </div>
      </div>

      <TeamRoster
        team={team}
        totalSlots={totalSlots}
        initialRoster={roster}
        availablePlayers={mockAvailablePlayers}
      />
    </div>
  );
}
