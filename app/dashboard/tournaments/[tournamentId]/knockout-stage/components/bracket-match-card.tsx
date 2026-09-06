"use client";

import { useState } from "react";
import { CalendarPlus, Pencil, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMatchDisplayStatus } from "@/app/dashboard/tournaments/lib/rules";
import type { KnockoutMatch, Team } from "@/app/dashboard/tournaments/lib/types";
import {
  SetMatchDialog,
  FinalScoreDialog,
} from "@/app/dashboard/tournaments/[tournamentId]/components/match-dialogs";

interface BracketMatchCardProps {
  match: KnockoutMatch;
  teamsById: Record<string, Team>;
}

export default function BracketMatchCard({ match, teamsById }: BracketMatchCardProps) {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scoreOpen, setScoreOpen] = useState(false);

  const home = match.homeTeamId ? teamsById[match.homeTeamId] : null;
  const away = match.awayTeamId ? teamsById[match.awayTeamId] : null;
  const isTbd = !home || !away;
  const displayStatus = getMatchDisplayStatus(match);

  const [datePart, timePart] = match.scheduledAt ? match.scheduledAt.split("T") : ["", ""];
  const formattedSchedule = match.scheduledAt
    ? new Date(match.scheduledAt).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : isTbd
    ? "Awaiting previous round"
    : "Not scheduled";

  return (
    <div className="overflow-hidden rounded-lg border border-teal-200 bg-white shadow-sm">
      <TeamRow flag={home?.flag} name={home?.name ?? "TBD"} score={match.homeScore} />
      <div className="border-t border-teal-100" />
      <TeamRow flag={away?.flag} name={away?.name ?? "TBD"} score={match.awayScore} />

      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-3 py-2">
        <span className="text-[11px] text-slate-500">{formattedSchedule}</span>

        {!isTbd && displayStatus === "unscheduled" && (
          <Button size="sm" variant="outline" className="h-7 gap-1 px-2 text-xs" onClick={() => setScheduleOpen(true)}>
            <CalendarPlus className="h-3 w-3" />
            Set Match
          </Button>
        )}
        {!isTbd && displayStatus === "upcoming" && (
          <Button size="sm" variant="outline" className="h-7 gap-1 px-2 text-xs" onClick={() => setScheduleOpen(true)}>
            <Pencil className="h-3 w-3" />
            Edit
          </Button>
        )}
        {!isTbd && displayStatus === "awaiting-score" && (
          <Button size="sm" className="h-7 gap-1 px-2 text-xs" onClick={() => setScoreOpen(true)}>
            <ClipboardCheck className="h-3 w-3" />
            Final Score
          </Button>
        )}
        {!isTbd && displayStatus === "completed" && (
          <Button size="sm" variant="ghost" className="h-7 gap-1 px-2 text-xs text-slate-500" onClick={() => setScoreOpen(true)}>
            <Pencil className="h-3 w-3" />
            Edit score
          </Button>
        )}
      </div>

      {!isTbd && (
        <>
          <SetMatchDialog
            open={scheduleOpen}
            onOpenChange={setScheduleOpen}
            homeTeamName={home?.name ?? ""}
            awayTeamName={away?.name ?? ""}
            defaultDate={datePart}
            defaultTime={timePart?.slice(0, 5)}
            onSave={(date, time) => console.log("Save KO schedule", match.id, date, time)}
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
            onSave={(hs, awayS) => console.log("Save KO score", match.id, hs, awayS)}
          />
        </>
      )}
    </div>
  );
}

function TeamRow({ flag, name, score }: { flag?: string; name: string; score: number | null }) {
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="text-base leading-none">{flag ?? "🏳️"}</span>
        <span className={`text-sm font-medium ${name === "TBD" ? "text-slate-400" : "text-slate-700"}`}>
          {name}
        </span>
      </div>
      {score !== null && <span className="text-sm font-semibold text-slate-800">{score}</span>}
    </div>
  );
}