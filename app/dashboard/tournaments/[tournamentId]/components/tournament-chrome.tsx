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
  const TeamBase = `/dashboard/tournaments/${tournament.id}/teams`;
  const isGroupDetailPage =
    pathname.startsWith(`${groupStageBase}/`) && pathname !== groupStageBase;
  const isTeamDetailPage =
    pathname.startsWith(`${TeamBase}/`) && pathname !== TeamBase;

  if (isGroupDetailPage || isTeamDetailPage) {

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