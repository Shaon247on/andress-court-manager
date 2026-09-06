"use client";

import { useState } from "react";
import { CalendarPlus, Pencil, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getMatchDisplayStatus } from "@/app/dashboard/tournaments/lib/rules";
import type { Match, Team } from "@/app/dashboard/tournaments/lib/types";
import {
  SetMatchDialog,
  FinalScoreDialog,
} from "@/app/dashboard/tournaments/[tournamentId]/components/match-dialogs";

interface GroupMatchesListProps {
  matches: Match[];
  teamsById: Record<string, Team>;
}

export default function GroupMatchesList({ matches, teamsById }: GroupMatchesListProps) {
  return (
    <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
      {matches.map((match) => (
        <MatchRow key={match.id} match={match} teamsById={teamsById} />
      ))}
    </div>
  );
}

function MatchRow({ match, teamsById }: { match: Match; teamsById: Record<string, Team> }) {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scoreOpen, setScoreOpen] = useState(false);

  const home = teamsById[match.homeTeamId];
  const away = teamsById[match.awayTeamId];
  const displayStatus = getMatchDisplayStatus(match);
  const [datePart, timePart] = match.scheduledAt ? match.scheduledAt.split("T") : ["", ""];

  const formattedSchedule = match.scheduledAt
    ? new Date(match.scheduledAt).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Not scheduled";

  return (
    <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-lg leading-none">{home?.flag}</span>
          <span className="text-sm font-medium text-slate-700">{home?.name}</span>
        </div>
        <span className="text-xs text-slate-400">vs</span>
        <div className="flex items-center gap-1.5">
          <span className="text-lg leading-none">{away?.flag}</span>
          <span className="text-sm font-medium text-slate-700">{away?.name}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {displayStatus === "completed" ? (
          <Badge variant="outline" className="border-slate-200 text-slate-700">
            {match.homeScore} - {match.awayScore}
          </Badge>
        ) : (
          <span className="text-xs text-slate-500">{formattedSchedule}</span>
        )}

        {displayStatus === "unscheduled" && (
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setScheduleOpen(true)}>
            <CalendarPlus className="h-3.5 w-3.5" />
            Set Match
          </Button>
        )}
        {displayStatus === "upcoming" && (
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setScheduleOpen(true)}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        )}
        {displayStatus === "awaiting-score" && (
          <Button size="sm" className="gap-1.5" onClick={() => setScoreOpen(true)}>
            <ClipboardCheck className="h-3.5 w-3.5" />
            Final Score
          </Button>
        )}
        {displayStatus === "completed" && (
          <Button size="sm" variant="ghost" className="gap-1.5 text-slate-500" onClick={() => setScoreOpen(true)}>
            <Pencil className="h-3.5 w-3.5" />
            Edit score
          </Button>
        )}
      </div>

      <SetMatchDialog
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        homeTeamName={home?.name ?? ""}
        awayTeamName={away?.name ?? ""}
        defaultDate={datePart}
        defaultTime={timePart?.slice(0, 5)}
        onSave={(date, time) => console.log("Save schedule", match.id, date, time)}
      />
      <FinalScoreDialog
        open={scoreOpen}
        onOpenChange={setScoreOpen}
        homeTeamName={home?.name ?? ""}
        homeTeamFlag={home?.flag ?? ""}
        awayTeamName={away?.name ?? ""}
        awayTeamFlag={away?.flag ?? ""}
        defaultHomeScore={match.homeScore}
        defaultAwayScore={match.awayScore}
        onSave={(hs, as_) => console.log("Save score", match.id, hs, as_)}
      />
    </div>
  );
}