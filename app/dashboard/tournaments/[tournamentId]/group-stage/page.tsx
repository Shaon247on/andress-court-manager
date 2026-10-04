
import { notFound, redirect } from "next/navigation";
import GroupStageClient from "./components/group-stage-client";
import {
  getTournamentDetailsAction,
  getTournamentMatchesAction,
  getTournamentTeamsAction,
} from "@/actions/manager-tournament.action";
import type { Group, Match } from "../../lib/types";

interface GroupStagePageProps {
  params: Promise<{ tournamentId: string }>;
}

export default async function GroupStagePage({ params }: GroupStagePageProps) {
  const { tournamentId } = await params;
  const [tournamentResult, teamsResult, matchesResult] = await Promise.all([
    getTournamentDetailsAction(tournamentId),
    getTournamentTeamsAction(tournamentId),
    getTournamentMatchesAction(tournamentId),
  ]);

  if (!tournamentResult.success) notFound();
  const tournament = tournamentResult.data;

  if (tournament.format !== "group_stage") {
    redirect(`/dashboard/tournaments/${tournamentId}/knockout-stage`);
  }

  const teams = teamsResult.success ? teamsResult.data.teams : [];
  const matchesByGroup = new Map<string, Match[]>();
  if (matchesResult.success) {
    for (const apiMatch of matchesResult.data.matches) {
      const groupName = apiMatch.group?.trim() || "Unassigned";
      const mappedMatch: Match = {
        id: apiMatch.id,
        homeTeamId: apiMatch.home_team,
        awayTeamId: apiMatch.away_team,
        status:
          apiMatch.status === "scheduled"
            ? "scheduled"
            : apiMatch.status === "completed"
              ? "completed"
              : apiMatch.status === "cancelled"
                ? "cancelled"
                : apiMatch.status === "ongoing"
                  ? "ongoing"
                  : "unscheduled",
        scheduledAt: apiMatch.match_time,
        homeScore: apiMatch.home_score,
        awayScore: apiMatch.away_score,
        courtName: apiMatch.court_name ?? null,
        match_time: apiMatch.match_time,
        court_id: apiMatch.court,
        notes: apiMatch.notes,
      };

      const current = matchesByGroup.get(groupName) ?? [];
      current.push(mappedMatch);
      matchesByGroup.set(groupName, current);
    }
  }

  const teamDataKey = teams.map((team) => `${team.id}:${team.updated_at}`).join("|");
  const defaultGroupSize = Math.max(1, Math.min(4, Math.ceil(tournament.number_of_teams / 2)));
  const groupedByName = new Map<string, typeof teams>();

  for (const team of teams) {
    const groupName = team.group && team.group.trim() ? team.group.trim() : `Group ${String.fromCharCode(65 + Math.floor((team.seed - 1) / defaultGroupSize))}`;
    const existing = groupedByName.get(groupName) ?? [];
    existing.push(team);
    groupedByName.set(groupName, existing);
  }

  const groups: Group[] = Array.from(groupedByName.entries())
    .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" }))
    .map(([groupName, groupTeams], groupIndex) => {
      const teamIds = groupTeams
        .sort((a, b) => a.seed - b.seed)
        .map((team) => team.id);
      const matches: Match[] = matchesByGroup.get(groupName) ?? [];

      return {
        id: `${tournamentId}-${groupName}`,
        name: groupName,
        tournamentId,
        teamIds,
        matches,
      };
    });

  return (
    <GroupStageClient
      key={`${tournamentId}:${teamDataKey}`}
      tournamentId={tournamentId}
      numberOfTeams={tournament.number_of_teams}
      groups={groups}
      teams={teams}
      loadError={teamsResult.success ? undefined : teamsResult.message}
    />
  );
}