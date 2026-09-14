"use client";

import type { Match, Team } from "@/app/dashboard/tournaments/lib/types";
import MatchRow from "./match-row";

interface GroupMatchesTableProps {
  matches: Match[];
  teamsById: Record<string, Team>;
}

export default function GroupMatchesTable({
  matches,
  teamsById,
}: GroupMatchesTableProps) {
  if (matches.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-400">
        No matches scheduled yet.
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Fake header row to mirror the standings header height */}
      <div className="sticky top-0 z-10 flex h-9 items-center border-b border-slate-100 bg-slate-50 px-3 text-xs font-medium text-slate-500">
        <span className="flex-1">Match</span>
        <span className="text-right">Court &amp; Date</span>
      </div>

      <div className="divide-y divide-slate-100">
        {matches.map((match) => (
          <MatchRow key={match.id} match={match} teamsById={teamsById} />
        ))}
      </div>
    </div>
  );
}