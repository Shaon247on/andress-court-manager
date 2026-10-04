import { redirect, notFound } from "next/navigation";
import { getTournamentDetailsAction } from "@/actions/manager-tournament.action";

interface TournamentPageProps {
  params: Promise<{ tournamentId: string }>;
}

export default async function TournamentPage({ params }: TournamentPageProps) {
  const { tournamentId } = await params;
  console.log("theid:",tournamentId)
  const result = await getTournamentDetailsAction(tournamentId);
  // if (!result.success) notFound();

  console.log("detials:",result)

  const target = result?.data?.format === "group_stage" ? "group-stage" : "knockout-stage";
  redirect(`/dashboard/tournaments/${tournamentId}/${target}`);
}