import TournamentForm from "./components/tournament-form";

export default function EditTournamentPage({
  params,
}: {
  params: { tournamentId: string };
}) {
  return (
    <div>
      <TournamentForm />
    </div>
  );
}
