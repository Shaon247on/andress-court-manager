import { notFound } from "next/navigation";
import { getTournamentDetailsAction } from "@/actions/manager-tournament.action";
import TournamentChrome from "./components/tournament-chrome";
import type { Currency, TeamType, Tournament } from "../lib/types";

interface TournamentLayoutProps {
  children: React.ReactNode;
  params: Promise<{ tournamentId: string }>;
}

export default async function TournamentLayout({
  children,
  params,
}: TournamentLayoutProps) {
  const { tournamentId } = await params;
  const result = await getTournamentDetailsAction(tournamentId);
  // if (!result.success) notFound();
  const apiTournament = result.data;
  const tournament: Tournament = {
    id: apiTournament?.id,
    name: apiTournament?.name,
    shortDescription: apiTournament?.short_description,
    rulesAndRegulations: apiTournament?.rules,
    category: apiTournament?.skill_category as Tournament["category"],
    teamType: apiTournament?.team_type as TeamType,
    teamCount: apiTournament?.number_of_teams,
    capacity: apiTournament?.total_capacity,
    entryFeePerPlayer: Number(apiTournament?.entry_fee_per_player),
    currency: apiTournament?.currency as Currency,
    format: apiTournament?.format,
    status: apiTournament?.status,
    createdAt: apiTournament?.created_at,
  };

  return (
    <div className="space-y-6 max-w-390 mx-auto pt-8">
      <TournamentChrome tournament={tournament} teams={[]} />
      {children}
    </div>
  );
}