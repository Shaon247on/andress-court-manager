"use client";

import { useState } from "react";
import { UserPlus, X } from "lucide-react";
import type { Player, Team } from "@/app/dashboard/tournaments/lib/types";
import AddPlayerDialog from "./add-player-dialog";

interface TeamRosterProps {
  team: Team;
  totalSlots: number;
  initialRoster: Player[];
  availablePlayers: Player[];
}

export default function TeamRoster({
  team,
  totalSlots,
  initialRoster,
  availablePlayers,
}: TeamRosterProps) {
  const [roster, setRoster] = useState<Player[]>(initialRoster);
  const [dialogOpen, setDialogOpen] = useState(false);

  const bookedCount = roster.length;
  const openSlots = Math.max(totalSlots - bookedCount, 0);
  const fillPercent = totalSlots > 0 ? Math.round((bookedCount / totalSlots) * 100) : 0;

  const handleAddPlayer = (player: Player) => {
    setRoster((prev) => (prev.some((p) => p.id === player.id) ? prev : [...prev, player]));
    console.log("Add player to team", team.id, player);
  };

  const handleRemovePlayer = (playerId: string) => {
    setRoster((prev) => prev.filter((p) => p.id !== playerId));
    console.log("Remove player from team", team.id, playerId);
  };

  const rosterIds = new Set(roster.map((p) => p.id));
  const searchablePlayers = availablePlayers.filter((p) => !rosterIds.has(p.id));

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-slate-700">
            {bookedCount} / {totalSlots} slots booked
          </p>
          <p className="text-xs text-slate-500">
            {openSlots} slot{openSlots === 1 ? "" : "s"} open
          </p>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-teal-500 transition-all"
            style={{ width: `${fillPercent}%` }}
          />
        </div>
      </div>

      {/* Slots grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {roster.map((player) => (
          <div
            key={player.id}
            className="group relative flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">
              {player.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">{player.name}</p>
              {player.position && <p className="text-xs text-slate-500">{player.position}</p>}
            </div>
            <button
              onClick={() => handleRemovePlayer(player.id)}
              aria-label={`Remove ${player.name}`}
              className="absolute right-2 top-2 hidden h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600 group-hover:flex"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {Array.from({ length: openSlots }).map((_, i) => (
          <button
            key={`empty-${i}`}
            onClick={() => setDialogOpen(true)}
            className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-500 transition-colors hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700"
          >
            <UserPlus className="h-4 w-4" />
            Add Player
          </button>
        ))}
      </div>

      <AddPlayerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        players={searchablePlayers}
        onSelectPlayer={handleAddPlayer}
      />
    </div>
  );
}