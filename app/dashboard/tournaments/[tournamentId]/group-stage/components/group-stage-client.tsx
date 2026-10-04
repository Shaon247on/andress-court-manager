"use client";

import { useState } from "react";
import { Pencil, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  assignTournamentGroupsAction,
  createTournamentTeamAction,
  deleteTournamentTeamAction,
  generateTournamentMatchesAction,
  updateTournamentTeamAction,
} from "@/actions/manager-tournament.action";
import GroupCard from "./group-card";
import type { Group } from "../../../lib/types";
import type { TournamentTeam } from "../../../lib/tournament.types";


interface GroupStageClientProps {
  tournamentId: string;
  numberOfTeams: number;
  groups: Group[];
  teams: TournamentTeam[];
  teamsPerGroup?: number;
  loadError?: string;
}

export default function GroupStageClient({
  tournamentId,
  numberOfTeams,
  groups,
  teams: initialTeams,
  teamsPerGroup = 4,
  loadError,
}: GroupStageClientProps) {
  const router = useRouter();
  const [teams, setTeams] = useState(initialTeams);
  const [originalTeams, setOriginalTeams] = useState(initialTeams);
  const [saving, setSaving] = useState(false);
  const [isRegeneratingMatches, setIsRegeneratingMatches] = useState(false);
  const [isAssigningGroups, setIsAssigningGroups] = useState(false);
  const [selectedTeamsPerGroup, setSelectedTeamsPerGroup] = useState(teamsPerGroup);

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
    setTeams(originalTeams);
    setSelectedTeamId(null);
    setIsEditMode(false);
  };

  const handleSeedSelect = (seed: number, targetTeamId: string | null) => {
    if (!isEditMode) return;
    if (!selectedTeamId) {
      if (targetTeamId) setSelectedTeamId(targetTeamId);
      return;
    }

    const selected = teams.find((team) => team.id === selectedTeamId);
    if (!selected) return setSelectedTeamId(null);
    if (selected.seed === seed) return setSelectedTeamId(null);

    const target = teams.find((team) => team.seed === seed);
    setTeams((current) => current.map((team) => {
      if (team.id === selected.id) return { ...team, seed };
      if (target && team.id === target.id) return { ...team, seed: selected.seed };
      return team;
    }));
    setSelectedTeamId(null);
  };

  const saveSeedChanges = async () => {
    const changed = teams.filter((team) => {
      const original = originalTeams.find((item) => item.id === team.id);
      return original && original.seed !== team.seed;
    });
    if (changed.length === 0) {
      setIsEditMode(false);
      return;
    }

    setSaving(true);
    const results = await Promise.all(
      changed.map((team) => updateTournamentTeamAction(team.id, { seed: team.seed }))
    );
    setSaving(false);
    if (results.some((result) => !result.success)) {
      toast.error(results.find((result) => !result.success)?.message ?? "Unable to save team positions");
      router.refresh();
      return;
    }

    setOriginalTeams(teams);
    setIsEditMode(false);

    setIsRegeneratingMatches(true);
    const generationResult = await generateTournamentMatchesAction(tournamentId);
    setIsRegeneratingMatches(false);

    if (!generationResult.success) {
      toast.error(generationResult.message || "Failed to regenerate matches");
      router.refresh();
      return;
    }

    toast.success("Group positions saved");
    router.refresh();
  };

  const createTeam = async (seed: number, name: string) => {
    const result = await createTournamentTeamAction(tournamentId, { name, seed });
    if (!result.success) {
      toast.error(result.message);
      return false;
    }
    setTeams((current) => [...current, result.data.team]);

    setIsRegeneratingMatches(true);
    const generationResult = await generateTournamentMatchesAction(tournamentId);
    setIsRegeneratingMatches(false);

    if (!generationResult.success) {
      toast.error(generationResult.message || "Team was added but matches could not be regenerated");
      router.refresh();
      return true;
    }

    toast.success("Team added");
    router.refresh();
    return true;
  };

  const renameTeam = async (teamId: string, name: string) => {
    const result = await updateTournamentTeamAction(teamId, { name });
    if (!result.success) {
      toast.error(result.message);
      return false;
    }
    setTeams((current) => current.map((team) => team.id === teamId ? result.data.team : team));
    toast.success("Team name updated");
    router.refresh();
    return true;
  };

  const deleteTeam = async (teamId: string) => {
    if (!window.confirm("Delete this team? This cannot be undone.")) return;
    const result = await deleteTournamentTeamAction(teamId);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    setTeams((current) => current.filter((team) => team.id !== teamId));

    setIsRegeneratingMatches(true);
    const generationResult = await generateTournamentMatchesAction(tournamentId);
    setIsRegeneratingMatches(false);

    if (!generationResult.success) {
      toast.error(generationResult.message || "Match regeneration failed after deleting the team");
      router.refresh();
      return;
    }

    toast.success("Team deleted");
    router.refresh();
  };

  const handleTeamsPerGroupChange = async (value: number) => {
    if (!Number.isFinite(value) || value <= 0) return;
    if (isAssigningGroups || isRegeneratingMatches) return;

    setIsAssigningGroups(true);
    const assignmentResult = await assignTournamentGroupsAction(tournamentId, value);
    setIsAssigningGroups(false);

    if (!assignmentResult.success) {
      toast.error(assignmentResult.message || "Failed to assign groups");
      return;
    }

    setSelectedTeamsPerGroup(value);

    setIsRegeneratingMatches(true);
    const generationResult = await generateTournamentMatchesAction(tournamentId);
    setIsRegeneratingMatches(false);

    if (!generationResult.success) {
      toast.error(generationResult.message || "Groups were reassigned, but matches could not be regenerated");
      router.refresh();
      return;
    }

    toast.success(assignmentResult.data.message || "Groups updated successfully");
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {loadError && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Could not load teams: {loadError}
        </p>
      )}
      {/* Page header */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-800">Groups</h2>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <span>Teams per group</span>
            <select
              value={selectedTeamsPerGroup}
              onChange={(event) => void handleTeamsPerGroupChange(Number(event.target.value))}
              disabled={isAssigningGroups || isRegeneratingMatches || isEditMode}
              className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 shadow-sm outline-none focus:border-teal-500 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              {[3, 4, 5, 6, 8].filter((value) => value > 0 && value <= numberOfTeams).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          {!isEditMode ? (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => {
                setOriginalTeams(teams);
                setIsEditMode(true);
              }}
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
                disabled={saving}
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </Button>
              <Button
                size="sm"
                className="gap-1.5"
                onClick={saveSeedChanges}
                disabled={saving}
              >
                <Check className="h-3.5 w-3.5" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Edit mode banner */}
      {isEditMode && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
          {selectedTeamId
            ? "Select another seed, including an empty slot, to move or swap this team."
            : "Select a team, then choose its destination seed."}
        </div>
      )}

      {/* Groups grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group, groupIndex) => (
          <GroupCard
            key={group.id}
            group={group}
            tournamentId={tournamentId}
            teams={teams}
            seedStart={groupIndex * 4 + 1}
            numberOfTeams={numberOfTeams}
            showMatches={matchesViewIds.has(group.id)}
            onToggleMatches={() => toggleMatchesView(group.id)}
            isEditMode={isEditMode}
            selectedTeamId={selectedTeamId}
            onSeedSelect={handleSeedSelect}
            onCreateTeam={createTeam}
            onRenameTeam={renameTeam}
            onDeleteTeam={deleteTeam}
          />
        ))}
      </div>
    </div>
  );
}