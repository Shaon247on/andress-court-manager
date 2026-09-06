import { redirect, notFound } from "next/navigation";
import { mockTournaments } from "../lib/mock-data";

interface TournamentPageProps {
  params: { tournamentId: string };
}

export default function TournamentPage({ params }: TournamentPageProps) {
  const tournament = mockTournaments.find((t) => t.id === params.tournamentId);

  if (!tournament) {
    notFound();
  }

  const target = tournament.hasGroupStage ? "group-stage" : "knockout-stage";
  redirect(`/dashboard/tournaments/${params.tournamentId}/${target}`);
}