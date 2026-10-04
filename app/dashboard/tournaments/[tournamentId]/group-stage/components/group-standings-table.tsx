// app/dashboard/tournaments/[tournamentId]/group-stage/components/group-standings-table.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import type { TournamentTeam } from "@/app/dashboard/tournaments/lib/tournament.types";
import type { Team } from "@/app/dashboard/tournaments/lib/types";
import { cn } from "@/lib/utils";

interface GroupStandingsTableProps {
  teams: TournamentTeam[];
  teamsById: Record<string, Team>;
  tournamentId: string;
  seedStart: number;
  numberOfTeams: number;
  isEditMode: boolean;
  selectedTeamId: string | null;
  onSeedSelect: (seed: number, teamId: string | null) => void;
  onCreateTeam: (seed: number, name: string) => Promise<boolean>;
  onRenameTeam: (teamId: string, name: string) => Promise<boolean>;
  onDeleteTeam: (teamId: string) => void;
}

export default function GroupStandingsTable({
  teams,
  teamsById,
  tournamentId,
  seedStart,
  numberOfTeams,
  isEditMode,
  selectedTeamId,
  onSeedSelect,
  onCreateTeam,
  onRenameTeam,
  onDeleteTeam,
}: GroupStandingsTableProps) {
  const [addingSeed, setAddingSeed] = useState<number | null>(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [saving, setSaving] = useState(false);
  const seeds = Array.from({ length: 4 }, (_, index) => seedStart + index)
    .filter((seed) => seed <= numberOfTeams);

  const stopRowClick = (event: React.MouseEvent) => event.stopPropagation();

  const saveNewTeam = async (seed: number) => {
    if (!newTeamName.trim()) return;
    setSaving(true);
    const saved = await onCreateTeam(seed, newTeamName.trim());
    setSaving(false);
    if (saved) {
      setAddingSeed(null);
      setNewTeamName("");
    }
  };

  const saveTeamName = async (teamId: string) => {
    if (!editedName.trim()) return;
    setSaving(true);
    const saved = await onRenameTeam(teamId, editedName.trim());
    setSaving(false);
    if (saved) setEditingTeamId(null);
  };

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="h-9 border-b border-slate-100 bg-slate-50 text-xs font-medium text-slate-500">
          <th className="w-12 px-2 text-center">Seed</th>
          <th className="px-3 text-left">Team</th>
          <th className="w-10 px-2 text-center">GP</th>
          <th className="w-10 px-2 text-center">W</th>
          <th className="w-10 px-2 text-center">D</th>
          <th className="w-10 px-2 text-center">L</th>
          <th className="w-12 bg-amber-100 px-2 text-center text-amber-800">
            PTS
          </th>
        </tr>
      </thead>
      <tbody>
        {seeds.map((seed) => {
          const team = teams.find((item) => item.seed === seed);
          const displayTeam = team && teamsById[team.id];
          const isSelected = selectedTeamId === team?.id;

          return (
            <tr
              key={seed}
              className={cn(
                "h-[52px] border-b border-slate-100 last:border-0 transition-colors",
                isEditMode && "cursor-pointer hover:bg-amber-50/50",
                isSelected && "bg-amber-100/60 hover:bg-amber-100/80"
              )}
              onClick={() => isEditMode && onSeedSelect(seed, team?.id ?? null)}
            >
              <td className="w-12 px-2 text-center">
                {isEditMode && (
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
                      isSelected
                        ? "border-amber-500 bg-amber-500"
                        : "border-slate-300 bg-white"
                    )}
                  >
                    {isSelected && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </span>
                )}
                {!isEditMode && <span className="font-medium text-slate-500">{seed}</span>}
              </td>

              <td className="px-3">
                {!team && addingSeed === seed && !isEditMode ? (
                  <form
                    className="flex items-center gap-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      void saveNewTeam(seed);
                    }}
                    onClick={stopRowClick}
                  >
                    <span className="w-5 text-center text-xs text-slate-400">{seed}</span>
                    <input
                      autoFocus
                      value={newTeamName}
                      onChange={(event) => setNewTeamName(event.target.value)}
                      placeholder="Team name"
                      aria-label={`Team name for seed ${seed}`}
                      className="h-8 min-w-0 flex-1 rounded-md border border-slate-200 px-2 text-sm outline-none focus:border-teal-500"
                    />
                    <button type="submit" disabled={saving || !newTeamName.trim()} aria-label="Save team" className="text-teal-700 disabled:opacity-50">
                      <Check className="h-4 w-4" />
                    </button>
                    <button type="button" aria-label="Cancel" onClick={() => { setAddingSeed(null); setNewTeamName(""); }} className="text-slate-400 hover:text-slate-700">
                      <X className="h-4 w-4" />
                    </button>
                  </form>
                ) : team ? (
                  <div className="flex min-w-0 items-center gap-1">
                    {editingTeamId === team.id && !isEditMode ? (
                      <form
                        className="flex min-w-0 flex-1 items-center gap-1"
                        onSubmit={(event) => { event.preventDefault(); void saveTeamName(team.id); }}
                        onClick={stopRowClick}
                      >
                        <input
                          autoFocus
                          value={editedName}
                          onChange={(event) => setEditedName(event.target.value)}
                          aria-label="Team name"
                          className="h-8 min-w-0 flex-1 rounded-md border border-slate-200 px-2 text-sm outline-none focus:border-teal-500"
                        />
                        <button type="submit" disabled={saving || !editedName.trim()} aria-label="Save team name" className="text-teal-700 disabled:opacity-50">
                          <Check className="h-4 w-4" />
                        </button>
                        <button type="button" aria-label="Cancel name edit" onClick={() => setEditingTeamId(null)} className="text-slate-400 hover:text-slate-700">
                          <X className="h-4 w-4" />
                        </button>
                      </form>
                    ) : isEditMode ? (
                      <span className="truncate font-medium text-slate-700">{team.name}</span>
                    ) : (
                  <Link
                    href={`/dashboard/tournaments/${tournamentId}/teams/${team?.id}`}
                        className="min-w-0 truncate rounded-md px-2 py-1 font-medium text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-800"
                  >
                        {team.name}
                  </Link>
                    )}
                    {!isEditMode && editingTeamId !== team.id && (
                      <>
                        <button
                          type="button"
                          aria-label={`Edit ${team.name}`}
                          onClick={(event) => { stopRowClick(event); setEditingTeamId(team.id); setEditedName(team.name); }}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${team.name}`}
                          onClick={(event) => { stopRowClick(event); onDeleteTeam(team.id); }}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                ) : !isEditMode ? (
                  <button
                    type="button"
                    aria-label={`Add team to seed ${seed}`}
                    onClick={(event) => { stopRowClick(event); setAddingSeed(seed); setNewTeamName(""); }}
                    className="flex h-8 items-center gap-2 rounded-md px-2 text-slate-400 hover:bg-teal-50 hover:text-teal-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-xs">Add team</span>
                  </button>
                ) : (
                  <span className="text-xs text-slate-300">Empty slot</span>
                )}
              </td>

              <td className="px-2 text-center font-medium text-green-700">
                {team?.game_played ?? "-"}
              </td>
              <td className="px-2 text-center text-slate-600">{team?.win ?? "-"}</td>
              <td className="px-2 text-center text-slate-600">{team?.draw ?? "-"}</td>
              <td className="px-2 text-center text-slate-600">{team?.lose ?? "-"}</td>
              <td className="bg-amber-50 px-2 text-center font-bold text-amber-800">
                {team?.points ?? "-"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}