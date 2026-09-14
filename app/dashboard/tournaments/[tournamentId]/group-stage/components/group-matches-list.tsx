"use client";

import MatchRow from "./match-row";
import type { Match, Team } from "@/app/dashboard/tournaments/lib/types";

interface GroupMatchesListProps {
  matches: Match[];
  teamsById: Record<string, Team>;
}

export default function GroupMatchesList({
  matches,
  teamsById,
}: GroupMatchesListProps) {
  return (
    <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
      {matches.map((match) => (
        <MatchRow key={match.id} match={match} teamsById={teamsById} />
      ))}
    </div>
  );
}