// app/dashboard/tournaments/[tournamentId]/group-stage/components/group-card.tsx

"use client";

import { ListOrdered, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Group, Team } from "@/app/dashboard/tournaments/lib/types";
import type { TournamentTeam } from "@/app/dashboard/tournaments/lib/tournament.types";
import GroupStandingsTable from "./group-standings-table";
import GroupMatchesTable from "./group-matches-table";

interface GroupCardProps {
  group: Group;
  tournamentId: string;
  teams: TournamentTeam[];
  seedStart: number;
  numberOfTeams: number;
  showMatches: boolean;
  onToggleMatches: () => void;
  isEditMode: boolean;
  selectedTeamId: string | null;
  onSeedSelect: (seed: number, teamId: string | null) => void;
  onCreateTeam: (seed: number, name: string) => Promise<boolean>;
  onRenameTeam: (teamId: string, name: string) => Promise<boolean>;
  onDeleteTeam: (teamId: string) => void;
}

export default function GroupCard({
  group,
  tournamentId,
  teams,
  seedStart,
  numberOfTeams,
  showMatches,
  onToggleMatches,
  isEditMode,
  selectedTeamId,
  onSeedSelect,
  onCreateTeam,
  onRenameTeam,
  onDeleteTeam,
}: GroupCardProps) {
  const teamsById: Record<string, Team> = Object.fromEntries(
    teams.map((team) => [team.id, { id: team.id, name: team.name, flag: "" }])
  );

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Shared teal header */}
      <div className="flex items-center justify-between bg-teal-500 px-4 py-2.5 text-white">
        <span className="text-sm font-semibold tracking-wide">
          {group.name}
        </span>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 gap-1.5 rounded-md bg-white/15 px-3 text-xs font-medium text-white hover:bg-white/25 hover:text-white"
          onClick={onToggleMatches}
          disabled={isEditMode}
        >
          {showMatches ? (
            <>
              <Table2 className="h-3.5 w-3.5" />
              Standings
            </>
          ) : (
            <>
              <ListOrdered className="h-3.5 w-3.5" />
              Matches
            </>
          )}
        </Button>
      </div>

      {/* Table area — fixed height so the card height never changes */}
      <div className="h-[248px] overflow-hidden">
        {showMatches ? (
          <GroupMatchesTable
            matches={group.matches}
            teamsById={teamsById}
          />
        ) : (
          <GroupStandingsTable
            teams={teams}
            teamsById={teamsById}
            tournamentId={tournamentId}
            seedStart={seedStart}
            numberOfTeams={numberOfTeams}
            isEditMode={isEditMode}
            selectedTeamId={selectedTeamId}
            onSeedSelect={onSeedSelect}
            onCreateTeam={onCreateTeam}
            onRenameTeam={onRenameTeam}
            onDeleteTeam={onDeleteTeam}
          />
        )}
      </div>
    </div>
  );
}