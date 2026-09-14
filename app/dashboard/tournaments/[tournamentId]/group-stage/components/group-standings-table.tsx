// app/dashboard/tournaments/[tournamentId]/group-stage/components/group-standings-table.tsx

"use client";

import Link from "next/link";
import type { Team } from "@/app/dashboard/tournaments/lib/types";
import type { StandingRow } from "@/app/dashboard/tournaments/lib/rules";
import { cn } from "@/lib/utils";

interface GroupStandingsTableProps {
  rows: StandingRow[];
  teamsById: Record<string, Team>;
  tournamentId: string;
  isEditMode: boolean;
  selectedTeamId: string | null;
  onTeamSelect: (teamId: string) => void;
}

export default function GroupStandingsTable({
  rows,
  teamsById,
  tournamentId,
  isEditMode,
  selectedTeamId,
  onTeamSelect,
}: GroupStandingsTableProps) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="h-9 border-b border-slate-100 bg-slate-50 text-xs font-medium text-slate-500">
          <th className="w-10 px-2" />
          <th className="px-3 text-left">Team</th>
          <th className="w-10 px-2 text-center">GP</th>
          <th className="w-10 px-2 text-center">W</th>
          <th className="w-10 px-2 text-center">D</th>
          <th className="w-10 px-2 text-center">L</th>
          <th className="w-12 bg-amber-100 px-2 text-center text-amber-800">
            PTS
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const team = teamsById[row.teamId];
          const isSelected = selectedTeamId === row.teamId;

          return (
            <tr
              key={row.teamId}
              className={cn(
                "h-[52px] border-b border-slate-100 last:border-0 transition-colors",
                isEditMode && "cursor-pointer hover:bg-amber-50/50",
                isSelected && "bg-amber-100/60 hover:bg-amber-100/80"
              )}
              onClick={() => isEditMode && onTeamSelect(row.teamId)}
            >
              <td className="w-10 px-2">
                {isEditMode && (
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
                      isSelected
                        ? "border-amber-500 bg-amber-500"
                        : "border-slate-300 bg-white"
                    )}
                  >
                    {isSelected && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </span>
                )}
              </td>

              <td className="px-3">
                {isEditMode ? (
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">
                      {team?.flag}
                    </span>
                    <span className="font-medium text-slate-700">
                      {team?.name}
                    </span>
                  </div>
                ) : (
                  <Link
                    href={`/dashboard/tournaments/${tournamentId}/teams/${team?.id}`}
                    className="flex items-center gap-2 rounded-full border border-transparent px-2 py-1 transition-colors hover:border-teal-300 hover:bg-teal-50"
                  >
                    <span className="text-base leading-none">
                      {team?.flag}
                    </span>
                    <span className="font-medium text-slate-700">
                      {team?.name}
                    </span>
                  </Link>
                )}
              </td>

              <td className="px-2 text-center font-medium text-green-700">
                {row.played}
              </td>
              <td className="px-2 text-center text-slate-600">{row.won}</td>
              <td className="px-2 text-center text-slate-600">{row.drawn}</td>
              <td className="px-2 text-center text-slate-600">{row.lost}</td>
              <td className="bg-amber-50 px-2 text-center font-bold text-amber-800">
                {row.points}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}