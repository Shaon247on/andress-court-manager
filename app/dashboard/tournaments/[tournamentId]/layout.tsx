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
      {/* <Link
        href="/dashboard/tournaments"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to tournaments
      </Link> */}

      <TournamentChrome tournament={tournament} teams={teams} />

      {children}
    </div>
  );
}