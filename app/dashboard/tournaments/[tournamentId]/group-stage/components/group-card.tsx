import { computeGroupStandings } from "@/app/dashboard/tournaments/lib/rules";
import { mockTeamsByTournament } from "@/app/dashboard/tournaments/lib/mock-data";
import type { Group } from "@/app/dashboard/tournaments/lib/types";
import GroupStandingsTable from "../[groupId]/components/group-standings-table";

interface GroupCardProps {
  group: Group;
  tournamentId: string;
}

export default function GroupCard({ group, tournamentId }: GroupCardProps) {
  const teams = mockTeamsByTournament[tournamentId] ?? [];
  const teamsById = Object.fromEntries(teams.map((t) => [t.id, t]));
  const rows = computeGroupStandings(group.teamIds, group.matches);

  return (
    <GroupStandingsTable
      groupName={group.name}
      rows={rows}
      teamsById={teamsById}
      viewHref={`/dashboard/tournaments/${tournamentId}/group-stage/${group.id}`}
    />
  );
}