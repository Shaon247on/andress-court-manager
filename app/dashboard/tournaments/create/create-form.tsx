
"use client";

import { TournamentForm } from "../components/tournament-form";
import { createTournamentAction } from "@/actions/manager-tournament.action";
import type { TournamentFormInput } from "../lib/types";

export default function CreateTournamentForm() {
  const handleSubmit = async (values: TournamentFormInput) => {
    const res = await createTournamentAction(values);
    if (res.success) {
      return { success: true };
    }
    return { success: false, message: res.message };
  };

  return <TournamentForm mode="create" onSubmitAction={handleSubmit} />;
}