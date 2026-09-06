import { notFound } from "next/navigation";
import {
  mockTournaments,
  mockGroupsByTournament,
  mockTeamsByTournament,
} from "@/app/dashboard/tournaments/lib/mock-data";
import { computeGroupStandings } from "@/app/dashboard/tournaments/lib/rules";
import GroupMatchesList from "./components/group-matches-list";
import GroupStandingsTable from "./components/group-standings-table";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface GroupDetailPageProps {
  params: { tournamentId: string; groupId: string };
}

export default function GroupDetailPage({ params }: GroupDetailPageProps) {
  const tournament = mockTournaments.find((t) => t.id === params.tournamentId);
  const groups = mockGroupsByTournament[params.tournamentId] ?? [];
  const group = groups.find((g) => g.id === params.groupId);

  if (!tournament || !group) notFound();

  const teams = mockTeamsByTournament[tournament.id] ?? [];
  const teamsById = Object.fromEntries(teams.map((t) => [t.id, t]));
  const rows = computeGroupStandings(group.teamIds, group.matches);

  return (
    <div className="space-y-6 overflow-scroll max-w-390 mx-auto no-scrollbar">
      <Link
        href={`/dashboard/tournaments/${params.tournamentId}/group-stage`}
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to groups
      </Link>
      <div>
        <h2 className="text-lg font-semibold text-slate-800">{group.name}</h2>
        <p className="text-sm text-slate-500">
          Standings and fixtures for {group.name.toLowerCase()}.
        </p>
      </div>

      <GroupStandingsTable
        groupName={group.name}
        rows={rows}
        teamsById={teamsById}
      />

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">
          Matches ({group.matches.length})
        </h3>
        <GroupMatchesList matches={group.matches} teamsById={teamsById} />
      </div>
    </div>
  );
}
