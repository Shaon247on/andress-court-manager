"use client";

import { useState } from "react";
import { Crown, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  assignTournamentPlayerAction,
  clearTournamentPlayerSlotAction,
} from "@/actions/manager-tournament.action";
import type {
  TournamentPlayerSearchResult,
  TournamentTeam,
} from "@/app/dashboard/tournaments/lib/tournament.types";
import AddPlayerDialog from "./add-player-dialog";

interface TeamRosterProps {
  initialTeam: TournamentTeam;
}

export default function TeamRoster({
  initialTeam,
}: TeamRosterProps) {
  const router = useRouter();
  const [team, setTeam] = useState(initialTeam);
  const [activeSlotNumber, setActiveSlotNumber] = useState<number | null>(null);
  const [pendingSlotNumber, setPendingSlotNumber] = useState<number | null>(null);

  const bookedCount = team.slots.filter((slot) => slot.user !== null).length;
  const openSlots = Math.max(team.total_slots - bookedCount, 0);
  const fillPercent = team.total_slots > 0 ? Math.round((bookedCount / team.total_slots) * 100) : 0;
  const slots = Array.from({ length: team.total_slots }, (_, index) => {
    const slotNumber = index + 1;
    return team.slots.find((slot) => slot.slot_number === slotNumber) ?? null;
  });

  const updateSlot = (updatedSlot: TournamentTeam["slots"][number]) => {
    setTeam((current) => {
      const slots = current.slots.some((slot) => slot.slot_number === updatedSlot.slot_number)
        ? current.slots.map((slot) => slot.slot_number === updatedSlot.slot_number ? updatedSlot : slot)
        : [...current.slots, updatedSlot];
      const filledSlotsCount = slots.filter((slot) => slot.user !== null).length;
      return {
        ...current,
        slots,
        filled_slots_count: filledSlotsCount,
        is_roster_complete: filledSlotsCount >= current.total_slots,
      };
    });
  };

  const assignPlayer = async (
    player: TournamentPlayerSearchResult,
    options: { is_captain: boolean; is_paid: boolean }
  ) => {
    if (activeSlotNumber === null) return false;
    const result = await assignTournamentPlayerAction(team.id, activeSlotNumber, {
      user_id: player.user_id,
      ...options,
    });
    if (!result.success) {
      toast.error(result.message);
      return false;
    }
    updateSlot(result.data.slot);
    setActiveSlotNumber(null);
    toast.success(result.data.message);
    router.refresh();
    return true;
  };

  const clearSlot = async (slotNumber: number) => {
    setPendingSlotNumber(slotNumber);
    const result = await clearTournamentPlayerSlotAction(team.id, slotNumber);
    setPendingSlotNumber(null);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    updateSlot(result.data.slot);
    toast.success(result.data.message);
    router.refresh();
  };

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-slate-700">
            {bookedCount} / {team.total_slots} slots booked
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
        {slots.map((slot, index) => {
          const slotNumber = index + 1;
          const playerName = slot?.display_player_name || slot?.user_full_name || slot?.player_name;
          if (!slot || !slot.user) {
            return (
              <button
                key={slot?.id ?? `empty-${slotNumber}`}
                onClick={() => setActiveSlotNumber(slotNumber)}
                className="flex min-h-20 items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-500 transition-colors hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700"
              >
                <UserPlus className="h-4 w-4" />
                Add player to slot {slotNumber}
              </button>
            );
          }

          return (
            <div key={slot.id} className="relative flex min-h-20 items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">
                {(playerName || "Player").split(" ").map((part) => part[0]).slice(0, 2).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">{playerName || "Player"}</p>
                <p className="truncate text-xs text-slate-500">Slot {slotNumber}{slot.user_email ? ` · ${slot.user_email}` : ""}</p>
                <div className="mt-1 flex gap-2 text-[11px]">
                  {slot.is_captain && <span className="inline-flex items-center gap-1 text-amber-700"><Crown className="h-3 w-3" /> Captain</span>}
                  <span className={slot.is_paid ? "text-green-700" : "text-slate-500"}>{slot.is_paid ? "Paid" : "Unpaid"}</span>
                </div>
              </div>
              <button
                onClick={() => void clearSlot(slotNumber)}
                disabled={pendingSlotNumber === slotNumber}
                aria-label={`Clear slot ${slotNumber}`}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      <AddPlayerDialog
        open={activeSlotNumber !== null}
        onOpenChange={(open) => { if (!open) setActiveSlotNumber(null); }}
        slotNumber={activeSlotNumber ?? 0}
        onAssignPlayer={assignPlayer}
      />
    </div>
  );
}