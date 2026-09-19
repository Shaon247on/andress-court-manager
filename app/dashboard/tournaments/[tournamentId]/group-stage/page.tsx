
import { notFound, redirect } from "next/navigation";
import GroupStageClient from "./components/group-stage-client";
import {
  mockGroupsByTournament,
  mockTournaments,
  mockTeamsByTournament,
} from "../../lib/mock-data";

interface GroupStagePageProps {
  params: { tournamentId: string };
}

export default function GroupStagePage({ params }: GroupStagePageProps) {
  const tournament = mockTournaments.find((t) => t.id === params.tournamentId);
  if (!tournament) notFound();

  // if (!tournament.hasGroupStage) {
  //   redirect(`/dashboard/tournaments/${params.tournamentId}/knockout-stage`);
  // }

  const groups = mockGroupsByTournament[tournament.id] ?? [];
  const teams = mockTeamsByTournament[tournament.id] ?? [];

  return (
    <GroupStageClient
      tournamentId={tournament.id}
      groups={groups}
      teams={teams}
    />
  );
}