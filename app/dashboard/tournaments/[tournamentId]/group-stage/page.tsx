import { notFound, redirect } from "next/navigation";
import GroupCard from "./components/group-card";
import { mockGroupsByTournament, mockTournaments } from "../../lib/mock-data";

interface GroupStagePageProps {
  params: { tournamentId: string };
}

export default function GroupStagePage({ params }: GroupStagePageProps) {
  const tournament = mockTournaments.find((t) => t.id === params.tournamentId);
  if (!tournament) notFound();

  if (!tournament.hasGroupStage) {
    redirect(`/dashboard/tournaments/${params.tournamentId}/knockout-stage`);
  }

  const groups = mockGroupsByTournament[tournament.id] ?? [];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Groups</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} tournamentId={tournament.id} />
        ))}
      </div>
    </div>
  );
}