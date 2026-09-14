// app/dashboard/tournaments/create/create-form.tsx

"use client";

import { useRouter } from "next/navigation";
import { TournamentForm } from "../components/tournament-form";
import type { TournamentFormInput } from "../lib/types";

export default function CreateTournamentForm() {
  const router = useRouter();

  const handleSubmit = async (values: TournamentFormInput) => {
    // TODO: replace with real server action
    // const res = await createTournamentAction(values);
    console.log("Create tournament:", values);

    // Simulated success for now
    return { success: true };
  };

  return <TournamentForm mode="create" onSubmitAction={handleSubmit} />;
}