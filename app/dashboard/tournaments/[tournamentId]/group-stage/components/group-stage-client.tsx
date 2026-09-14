"use client";

import { useState } from "react";
import { Pencil, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import GroupCard from "./group-card";
import { Group, Team } from "../../../lib/types";


interface GroupStageClientProps {
  tournamentId: string;
  groups: Group[];
  teams: Team[];
}

export default function GroupStageClient({
  tournamentId,
  groups,
  teams,
}: GroupStageClientProps) {
  // ── Per-group toggle: a Set of group IDs currently showing matches ──
  const [matchesViewIds, setMatchesViewIds] = useState<Set<string>>(new Set());

  // ── Edit Teams mode ──
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const toggleMatchesView = (groupId: string) => {
    setMatchesViewIds((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const exitEditMode = () => {
    setSelectedTeamId(null);
    setIsEditMode(false);
  };

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Groups</h2>

        {!isEditMode ? (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => setIsEditMode(true)}
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Teams
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5"
              onClick={exitEditMode}
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => {
                // TODO: persist swaps
                exitEditMode();
              }}
            >
              <Check className="h-3.5 w-3.5" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Edit mode banner */}
      {isEditMode && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
          {selectedTeamId
            ? "Now select a team from another group to swap positions."
            : "Select a team to swap. Tap any team to begin."}
        </div>
      )}

      {/* Groups grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            tournamentId={tournamentId}
            teams={teams}
            showMatches={matchesViewIds.has(group.id)}
            onToggleMatches={() => toggleMatchesView(group.id)}
            isEditMode={isEditMode}
            selectedTeamId={selectedTeamId}
            onTeamSelect={(teamId) => {
              if (!isEditMode) return;
              if (!selectedTeamId) {
                setSelectedTeamId(teamId);
              } else if (selectedTeamId === teamId) {
                setSelectedTeamId(null);
              } else {
                // TODO: fire swap API
                setSelectedTeamId(null);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}