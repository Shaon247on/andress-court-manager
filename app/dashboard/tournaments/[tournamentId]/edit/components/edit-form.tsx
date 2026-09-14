"use client";

import { useRouter } from "next/navigation";
import { TournamentFormInput } from "../../../lib/types";
import { TournamentForm } from "../../../components/tournament-form";

interface EditTournamentFormProps {
  tournamentId: string;
  initialValues: Partial<TournamentFormInput>;
}

export default function EditTournamentForm({
  tournamentId,
  initialValues,
}: EditTournamentFormProps) {
  const router = useRouter();

  const handleSubmit = async (values: TournamentFormInput) => {
    // TODO: replace with real server action
    // const res = await updateTournamentAction(tournamentId, values);
    console.log("Update tournament:", tournamentId, values);

    return { success: true };
  };

  return (
    <TournamentForm
      mode="edit"
      initialValues={initialValues}
      onSubmitAction={handleSubmit}
    />
  );
}