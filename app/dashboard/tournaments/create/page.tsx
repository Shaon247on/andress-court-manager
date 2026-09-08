import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TournamentForm } from "./components/tournament-form";

export default function CreateTournamentPage() {
  return (
    <div className="mx-auto max-w-390 space-y-6 pt-8">
      <Link
        href="/dashboard/tournaments"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to tournaments
      </Link>
      <TournamentForm />
    </div>
  );
}