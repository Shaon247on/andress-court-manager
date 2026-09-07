"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Player } from "@/app/dashboard/tournaments/lib/types";

interface AddPlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  players: Player[];
  onSelectPlayer: (player: Player) => void;
}

export default function AddPlayerDialog({
  open,
  onOpenChange,
  players,
  onSelectPlayer,
}: AddPlayerDialogProps) {
  const [query, setQuery] = useState("");
  const filtered = players.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setQuery("");
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add player</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players..."
            className="pl-9"
          />
        </div>

        <div className="max-h-64 space-y-1 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-slate-500">No players found.</p>
          )}
          {filtered.map((player) => (
            <button
              key={player.id}
              onClick={() => {
                onSelectPlayer(player);
                onOpenChange(false);
                setQuery("");
              }}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-slate-50"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-700">
                {player.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-800">{player.name}</p>
                {player.position && <p className="text-xs text-slate-500">{player.position}</p>}
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}