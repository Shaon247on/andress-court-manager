// app/dashboard/tournaments/[tournamentId]/group-stage/components/edit-teams-banner.tsx

"use client";

import { MousePointerClick } from "lucide-react";

interface EditTeamsBannerProps {
  hasSelection: boolean;
}

export default function EditTeamsBanner({ hasSelection }: EditTeamsBannerProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
      <MousePointerClick className="h-4 w-4 shrink-0" />
      {hasSelection
        ? "Now select a team from another group to swap positions."
        : "Select a team to swap. Tap any team to begin."}
    </div>
  );
}