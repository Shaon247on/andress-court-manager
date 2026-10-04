"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { searchTournamentPlayersAction } from "@/actions/manager-tournament.action";
import type { TournamentPlayerSearchResult } from "@/app/dashboard/tournaments/lib/tournament.types";

interface AddPlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slotNumber: number;
  onAssignPlayer: (
    player: TournamentPlayerSearchResult,
    options: { is_captain: boolean; is_paid: boolean }
  ) => Promise<boolean>;
}

export default function AddPlayerDialog({
  open,
  onOpenChange,
  slotNumber,
  onAssignPlayer,
}: AddPlayerDialogProps) {
  const [query, setQuery] = useState("");
  const [resultQuery, setResultQuery] = useState("");
  const [players, setPlayers] = useState<TournamentPlayerSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCaptain, setIsCaptain] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [assigningUserId, setAssigningUserId] = useState<string | null>(null);

  useEffect(() => {
    const search = query.trim();
    if (!open || search.length < 2) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      const result = await searchTournamentPlayersAction({ search, limit: 20 });
      if (cancelled) return;
      setLoading(false);
      if (result.success) {
        setPlayers(result.data.results);
        setResultQuery(search);
        setError(null);
      } else {
        setPlayers([]);
        setResultQuery(search);
        setError(result.message);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [open, query]);

  const assignPlayer = async (player: TournamentPlayerSearchResult) => {
    setAssigningUserId(player.user_id);
    const success = await onAssignPlayer(player, { is_captain: isCaptain, is_paid: isPaid });
    setAssigningUserId(null);
    if (success) {
      onOpenChange(false);
      setQuery("");
      setIsCaptain(false);
      setIsPaid(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) {
          setQuery("");
          setIsCaptain(false);
          setIsPaid(false);
        }
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Assign player to slot {slotNumber}</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or username"
            className="pl-9"
          />
        </div>

        <div className="flex gap-5 text-sm text-slate-700">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isCaptain} onChange={(event) => setIsCaptain(event.target.checked)} />
            Captain
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isPaid} onChange={(event) => setIsPaid(event.target.checked)} />
            Paid
          </label>
        </div>

        <div className="max-h-64 space-y-1 overflow-y-auto">
          {query.trim().length < 2 && (
            <p className="py-6 text-center text-sm text-slate-500">Enter at least 2 characters to search.</p>
          )}
          {loading && <p className="py-6 text-center text-sm text-slate-500">Searching...</p>}
          {query.trim().length >= 2 && resultQuery === query.trim() && error && <p role="alert" className="py-4 text-center text-sm text-red-600">{error}</p>}
          {!loading && resultQuery === query.trim() && !error && query.trim().length >= 2 && players.length === 0 && (
            <p className="py-6 text-center text-sm text-slate-500">No players found.</p>
          )}
          {resultQuery === query.trim() && !error && players.map((player) => (
            <button
              key={player.user_id}
              disabled={assigningUserId !== null}
              onClick={() => void assignPlayer(player)}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-slate-50"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-700">
                {player.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-800">{player.name}</p>
                <p className="truncate text-xs text-slate-500">{player.email}</p>
              </div>
              {assigningUserId === player.user_id && <span className="ml-auto text-xs text-slate-500">Assigning...</span>}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}