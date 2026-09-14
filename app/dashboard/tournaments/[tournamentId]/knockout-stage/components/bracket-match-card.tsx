// app/dashboard/tournaments/[tournamentId]/knockout-stage/components/bracket-match-card.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CalendarPlus, Pencil, ClipboardCheck, MapPin } from "lucide-react";
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

export default function BracketMatchCard({
  match,
  teamsById,
}: BracketMatchCardProps) {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scoreOpen, setScoreOpen] = useState(false);

  // ── Read tournamentId directly from the URL ──
  const params = useParams<{ tournamentId: string }>();
  const tournamentId = params?.tournamentId ?? "";

  const home = match.homeTeamId ? teamsById[match.homeTeamId] : null;
  const away = match.awayTeamId ? teamsById[match.awayTeamId] : null;
  const isTbd = !home || !away;
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
    : isTbd
    ? "TBD"
    : "Not scheduled";

  return (
    <div className="overflow-hidden rounded-md border border-teal-500 shadow-sm">
      <TeamRow
        flag={home?.flag}
        name={home?.name ?? "TBD"}
        score={match.homeScore}
        teamId={home?.id}
        tournamentId={tournamentId}
      />
      <div className="h-px bg-white" />
      <TeamRow
        flag={away?.flag}
        name={away?.name ?? "TBD"}
        score={match.awayScore}
        teamId={away?.id}
        tournamentId={tournamentId}
      />

      {/* Meta / actions footer */}
      <div className="flex items-center justify-between border-t border-teal-500 bg-white px-3 py-1.5">
        <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
          {match.courtName && (
            <>
              <MapPin className="h-2.5 w-2.5" />
              <span className="truncate max-w-[80px]">{match.courtName}</span>
              <span className="text-slate-300">•</span>
            </>
          )}
          <span>{formattedSchedule}</span>
        </div>

        {!isTbd && displayStatus === "unscheduled" && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1 px-2 text-xs"
            onClick={() => setScheduleOpen(true)}
          >
            <CalendarPlus className="h-3 w-3" />
            Set Match
          </Button>
        )}
        {!isTbd && displayStatus === "upcoming" && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1 px-2 text-xs"
            onClick={() => setScheduleOpen(true)}
          >
            <Pencil className="h-3 w-3" />
            Edit
          </Button>
        )}
        {!isTbd && displayStatus === "awaiting-score" && (
          <Button
            size="sm"
            className="h-7 gap-1 px-2 text-xs"
            onClick={() => setScoreOpen(true)}
          >
            <ClipboardCheck className="h-3 w-3" />
            Final Score
          </Button>
        )}
        {!isTbd && displayStatus === "completed" && (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 gap-1 px-2 text-xs text-slate-500"
            onClick={() => setScoreOpen(true)}
          >
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
            onSave={(date, time) =>
              console.log("Save KO schedule", match.id, date, time)
            }
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
            onSave={(hs, awayS) =>
              console.log("Save KO score", match.id, hs, awayS)
            }
          />
        </>
      )}
    </div>
  );
}

// ── TeamRow (clickable) ──

function TeamRow({
  flag,
  name,
  score,
  teamId,
  tournamentId,
}: {
  flag?: string;
  name: string;
  score: number | null;
  teamId?: string;
  tournamentId: string;
}) {
  const content = (
    <div className="flex items-center justify-between bg-teal-400 px-3 py-2 transition-colors">
      <div className="flex min-w-0 items-center gap-2">
        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white text-sm leading-none">
          {flag ?? "🏳️"}
        </span>
        <span className="truncate text-xs font-bold uppercase tracking-wide text-slate-900">
          {name}
        </span>
      </div>
      {score !== null && (
        <span className="pl-2 text-sm font-bold text-slate-900">{score}</span>
      )}
    </div>
  );

  // TBD rows or missing tournamentId → not clickable
  if (!teamId || !tournamentId) return content;

  return (
    <Link
      href={`/dashboard/tournaments/${tournamentId}/teams/${teamId}`}
      className="block hover:bg-teal-300"
    >
      {content}
    </Link>
  );
}