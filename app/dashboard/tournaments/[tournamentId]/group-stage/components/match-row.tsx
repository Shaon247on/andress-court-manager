// app/dashboard/tournaments/[tournamentId]/group-stage/components/match-row.tsx

"use client";

import { useState } from "react";
import {
  CalendarPlus,
  Pencil,
  ClipboardCheck,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getMatchDisplayStatus } from "@/app/dashboard/tournaments/lib/rules";
import type { Match, Team } from "@/app/dashboard/tournaments/lib/types";
import {
  SetMatchDialog,
  FinalScoreDialog,
} from "@/app/dashboard/tournaments/[tournamentId]/components/match-dialogs";

interface MatchRowProps {
  match: Match;
  teamsById: Record<string, Team>;
}

export default function MatchRow({ match, teamsById }: MatchRowProps) {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scoreOpen, setScoreOpen] = useState(false);

  const home = teamsById[match.homeTeamId];
  const away = teamsById[match.awayTeamId];
  const displayStatus = getMatchDisplayStatus(match);

  const [datePart, timePart] = match.scheduledAt
    ? match.scheduledAt.split("T")
    : ["", ""];

  const formattedSchedule = match.scheduledAt
    ? new Date(match.scheduledAt).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="flex h-[52px] items-center gap-2 px-3">
      {/* Left: Teams */}
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        <span className="shrink-0 text-sm leading-none">{home?.flag}</span>
        <span className="truncate text-xs font-medium text-slate-700">
          {home?.name}
        </span>
        <span className="mx-0.5 shrink-0 text-[10px] text-slate-400">vs</span>
        <span className="shrink-0 text-sm leading-none">{away?.flag}</span>
        <span className="truncate text-xs font-medium text-slate-700">
          {away?.name}
        </span>
      </div>

      {/* Middle: Status / Score / Date */}
      <div className="flex shrink-0 items-center gap-2">
        {displayStatus === "completed" ? (
          <Badge
            variant="outline"
            className="border-slate-200 px-1.5 py-0 text-[10px] text-slate-700"
          >
            {match.homeScore} - {match.awayScore}
          </Badge>
        ) : formattedSchedule ? (
          <span className="text-[10px] text-slate-500">
            {formattedSchedule}
          </span>
        ) : (
          <span className="text-[10px] text-slate-400">—</span>
        )}

        {match.courtName && (
          <span className="hidden items-center gap-0.5 text-[10px] text-slate-500 sm:flex">
            <MapPin className="h-2.5 w-2.5" />
            <span className="truncate max-w-[60px]">{match.courtName}</span>
          </span>
        )}
      </div>

      {/* Right: Action button */}
      <div className="shrink-0">
        {displayStatus === "unscheduled" && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1 px-2 text-[10px]"
            onClick={() => setScheduleOpen(true)}
          >
            <CalendarPlus className="h-3 w-3" />
            Set Match
          </Button>
        )}
        {displayStatus === "upcoming" && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1 px-2 text-[10px]"
            onClick={() => setScheduleOpen(true)}
          >
            <Pencil className="h-3 w-3" />
            Edit Date
          </Button>
        )}
        {displayStatus === "awaiting-score" && (
          <Button
            size="sm"
            className="h-7 gap-1 px-2 text-[10px]"
            onClick={() => setScoreOpen(true)}
          >
            <ClipboardCheck className="h-3 w-3" />
            Set Score
          </Button>
        )}
        {displayStatus === "completed" && (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 gap-1 px-2 text-[10px] text-slate-500"
            onClick={() => setScoreOpen(true)}
          >
            <Pencil className="h-3 w-3" />
            Edit Score
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
        onSave={(date, time) =>
          console.log("Save schedule", match.id, date, time)
        }
      />
      <FinalScoreDialog
        open={scoreOpen}
        onOpenChange={setScoreOpen}
        homeTeamName={home?.name ?? ""}
        awayTeamName={away?.name ?? ""}
        homeTeamFlag={home?.flag ?? ""}
        awayTeamFlag={away?.flag ?? ""}
        defaultHomeScore={match.homeScore}
        defaultAwayScore={match.awayScore}
        onSave={(hs, as_) => console.log("Save score", match.id, hs, as_)}
      />
    </div>
  );
}