import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { mockTournaments, mockTeamsByTournament } from "../lib/mock-data";
import TournamentChrome from "./components/tournament-chrome";

interface TournamentLayoutProps {
  children: React.ReactNode;
  params: { tournamentId: string };
}

export default function TournamentLayout({
  children,
  params,
}: TournamentLayoutProps) {
  const tournament = mockTournaments.find((t) => t.id === params.tournamentId);

  if (!tournament) {
    notFound();
  }

  const teams = mockTeamsByTournament[tournament.id] ?? [];

  return (
    <div className="space-y-6 max-w-390 mx-auto pt-8">
      <TournamentChrome tournament={tournament} teams={teams} />
      {children}
    </div>
  );
}