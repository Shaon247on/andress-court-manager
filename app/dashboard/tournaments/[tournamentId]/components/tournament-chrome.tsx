"use client";

import { usePathname } from "next/navigation";
import TournamentHeader from "./tournament-header";
import StageTabs from "./stage-tabs";
import type { Tournament, Team } from "../../lib/types";

interface TournamentChromeProps {
  tournament: Tournament;
  teams: Team[];
}

export default function TournamentChrome({ tournament, teams }: TournamentChromeProps) {
  const pathname = usePathname();
  const groupStageBase = `/dashboard/tournaments/${tournament.id}/group-stage`;
  const isGroupDetailPage =
    pathname.startsWith(`${groupStageBase}/`) && pathname !== groupStageBase;

  if (isGroupDetailPage) {
    // Still show the stage tabs so the user can navigate away —
    // just hide the name/description/teams block on this page.
    return (
     <></>
    );
  }

  return (
    <>
      <TournamentHeader tournament={tournament} teams={teams} />
      <StageTabs tournamentId={tournament.id} hasGroupStage={tournament.hasGroupStage} />
    </>
  );
}