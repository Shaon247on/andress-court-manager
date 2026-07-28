"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Users,
  Trash2,
  CalendarIcon,
  Zap,
  Flag,
  UserPlus,
  Loader2,
  Eye,
  EyeOff,
  Crown,
  Infinity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createBookingAction,
  updateBookingAction,
  searchUsersAction,
} from "@/actions/manager-booking.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type {
  BookingDetail,
  SearchUserResult,
} from "@/types/ManagerBooking.type";
import { toast } from "sonner";
import { hoursToTimeString } from "@/lib/schedule-time";

type BookingType = "regular" | "lesson" | "event";
type PlayerSlot = {
  id: string;
  name: string;
  userId: string;
  position: string;
  isPaid: boolean;
  isOwner: boolean;
};

interface CourtData {
  id: string;
  name: string;
  formats: string[];
  pricePerHour: string;
}

interface CreateBookingSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourt: string;
  startTime: number;
  endTime: number;
  date: Date;
  editingBooking: BookingDetail | null;
  courtsData: CourtData[];
  onSuccess: () => void;
}

export function CreateBookingSheet({
  isOpen,
  onClose,
  selectedCourt,
  startTime,
  endTime,
  date,
  editingBooking,
  courtsData,
  onSuccess,
}: CreateBookingSheetProps) {
  const [bookingType, setBookingType] = useState<BookingType>("regular");
  const [repeatType, setRepeatType] = useState<string>("none");
  const [paymentType, setPaymentType] = useState<"single" | "split">("single");
  const [gameFormat, setGameFormat] = useState<string>("5v5");
  const [visibility, setVisibility] = useState<"private" | "public">("private");
  const [isCompetitive, setIsCompetitive] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUserResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<"a" | "b">("a");

  const [teamASlots, setTeamASlots] = useState<PlayerSlot[]>([]);
  const [teamBSlots, setTeamBSlots] = useState<PlayerSlot[]>([]);

  // In 'single' payment mode, this tracks WHO is covering the full amount
  const [payerId, setPayerId] = useState<string | null>(null);

  // ── Check if in edit mode ──
  const isEditMode = !!editingBooking;

  const currentCourt = useMemo(() => {
    return courtsData.find((c) => c.id === selectedCourt);
  }, [courtsData, selectedCourt]);

  const availableFormats = useMemo(() => {
    return currentCourt?.formats || ["5v5", "7v7", "11v11"];
  }, [currentCourt]);

  const pricePerHour = useMemo(() => {
    return parseFloat(currentCourt?.pricePerHour || "0");
  }, [currentCourt]);

  // ── Calculate duration in hours ──
  const durationInHours = useMemo(() => {
    return Math.max(0, endTime - startTime);
  }, [startTime, endTime]);

  // ── Calculate total price (price per hour * duration) ──
  const totalPrice = useMemo(() => {
    return pricePerHour * durationInHours;
  }, [pricePerHour, durationInHours]);

  // ── Calculate split price per person ──
  const splitPricePerPerson = useCallback(() => {
    const formatNum = parseInt(gameFormat) || 5;
    const totalPlayers = formatNum * 2;
    if (totalPlayers === 0) return totalPrice.toFixed(2);
    return (totalPrice / totalPlayers).toFixed(2);
  }, [totalPrice, gameFormat]);

  const formatSlotTime = (num: number) => hoursToTimeString(num);

  const currentOwner = useMemo(() => {
    return (
      teamASlots.find((s) => s.isOwner) ||
      teamBSlots.find((s) => s.isOwner) ||
      null
    );
  }, [teamASlots, teamBSlots]);

  const getDisplayAmount = useCallback(
    (slot: PlayerSlot, team: "a" | "b") => {
      if (paymentType === "split") return splitPricePerPerson();
      const key = `${team}:${slot.id}`;
      return payerId === key ? totalPrice.toFixed(2) : "0.00";
    },
    [paymentType, payerId, totalPrice, splitPricePerPerson],
  );

  const bookingTypeConfig = {
    regular: { label: "Match", color: "bg-blue-500", icon: CalendarIcon },
    lesson: { label: "Lesson", color: "bg-green-500", icon: Zap },
    event: { label: "Event", color: "bg-amber-500", icon: Flag },
  };

  // ── Set default payment type based on booking type ──
  useEffect(() => {
    if (bookingType === "regular") {
      setPaymentType("split");
    } else if (bookingType === "lesson" || bookingType === "event") {
      setPaymentType("single");
    }
  }, [bookingType]);

  // ── Auto-set first player as owner ──
  useEffect(() => {
    // When a player is added to Team A and no owner exists, auto-set as owner
    if (teamASlots.length > 0 && !currentOwner) {
      setTeamASlots((prev) =>
        prev.map((slot, index) => ({
          ...slot,
          isOwner: index === 0,
        })),
      );
    }
  }, [teamASlots.length, currentOwner]);

  // ── Handle editing booking initialization ──
  useEffect(() => {
    if (editingBooking) {
      setBookingType(editingBooking.booking_type);
      setRepeatType(editingBooking.repeat_type || "none");
      setPaymentType(editingBooking.payment_type);
      setGameFormat(editingBooking.game_format || "5v5");
      setVisibility(editingBooking.visibility || "private");

      const toSlot = (
        p: (typeof editingBooking.participants)[number],
      ): PlayerSlot => ({
        id: p.id,
        name: p.player_name,
        userId: p.user_id,
        position: p.position_role || "",
        isPaid: p.is_paid,
        isOwner: p.is_game_owner,
      });

      const aSlots = editingBooking.participants
        .filter((p) => p.team === "a")
        .map(toSlot);
      const bSlots = editingBooking.participants
        .filter((p) => p.team === "b")
        .map(toSlot);
      setTeamASlots(aSlots);
      setTeamBSlots(bSlots);

      if (editingBooking.payment_type === "single") {
        const paidA = aSlots.find((s) => s.isPaid);
        const paidB = bSlots.find((s) => s.isPaid);
        if (paidA) setPayerId(`a:${paidA.id}`);
        else if (paidB) setPayerId(`b:${paidB.id}`);
        else setPayerId(null);
      } else {
        setPayerId(null);
      }
    }
  }, [editingBooking]);

  useEffect(() => {
    if (!isOpen) {
      if (!editingBooking) {
        setTeamASlots([]);
        setTeamBSlots([]);
        setBookingType("regular");
        setRepeatType("none");
        setPaymentType("split");
        setGameFormat(availableFormats[0] || "5v5");
        setVisibility("private");
        setIsCompetitive(true);
        setPayerId(null);
      }
      setSearchDialogOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [isOpen, editingBooking, availableFormats]);

  useEffect(() => {
    if (availableFormats.length > 0 && !availableFormats.includes(gameFormat)) {
      setGameFormat(availableFormats[0]);
    }
  }, [availableFormats, gameFormat]);

  const handleBookingTypeChange = (type: BookingType) => {
    // ── Prevent changing booking type in edit mode ──
    if (isEditMode) {
      toast.info("Booking type cannot be changed in edit mode");
      return;
    }
    setBookingType(type);
    // Reset payment type based on booking type
    if (type === "regular") {
      setPaymentType("split");
    } else if (type === "lesson" || type === "event") {
      setPaymentType("single");
    }
  };

  const handlePaymentTypeChange = (val: string) => {
    const newType = val as "single" | "split";
    setPaymentType(newType);
    setPayerId(null);
    setTeamASlots((prev) => prev.map((s) => ({ ...s, isPaid: false })));
    setTeamBSlots((prev) => prev.map((s) => ({ ...s, isPaid: false })));
  };

  const handleAddPlayer = (user: SearchUserResult, team: "a" | "b") => {
    const newSlot: PlayerSlot = {
      id: `temp-${Date.now()}`,
      name: user.name,
      userId: user.user_id,
      position: user.preferred_position || "",
      isPaid: false,
      isOwner: false,
    };
    if (team === "a") {
      setTeamASlots((prev) => {
        const updated = [...prev, newSlot];
        // If this is the first player in Team A and no owner exists, set as owner
        if (updated.length === 1 && !currentOwner) {
          updated[0].isOwner = true;
        }
        return updated;
      });
    } else {
      setTeamBSlots((prev) => [...prev, newSlot]);
    }
    setSearchDialogOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleRemovePlayer = (team: "a" | "b", index: number) => {
    if (team === "a")
      setTeamASlots((prev) => prev.filter((_, i) => i !== index));
    else setTeamBSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTogglePaid = (team: "a" | "b", index: number) => {
    const slots = team === "a" ? teamASlots : teamBSlots;
    const slot = slots[index];
    if (!slot) return;

    if (paymentType === "split") {
      const updater = (s: PlayerSlot, i: number) =>
        i === index ? { ...s, isPaid: !s.isPaid } : s;
      if (team === "a") setTeamASlots((prev) => prev.map(updater));
      else setTeamBSlots((prev) => prev.map(updater));
      return;
    }

    const key = `${team}:${slot.id}`;
    if (payerId === key) {
      setPayerId(null);
      setTeamASlots((prev) => prev.map((s) => ({ ...s, isPaid: false })));
      setTeamBSlots((prev) => prev.map((s) => ({ ...s, isPaid: false })));
    } else {
      setPayerId(key);
      setTeamASlots((prev) => prev.map((s) => ({ ...s, isPaid: true })));
      setTeamBSlots((prev) => prev.map((s) => ({ ...s, isPaid: true })));
    }
  };

  const handleSetOwner = (team: "a" | "b", index: number) => {
    setTeamASlots((prev) =>
      prev.map((slot, i) => ({
        ...slot,
        isOwner: team === "a" && i === index,
      })),
    );
    setTeamBSlots((prev) =>
      prev.map((slot, i) => ({
        ...slot,
        isOwner: team === "b" && i === index,
      })),
    );
  };

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    const res = await searchUsersAction({ q: query, limit: 20 });
    if (res.success) setSearchResults(res.data.results);
    else toast.error(res.message);
    setSearching(false);
  };

  const handleSubmit = async () => {
    if (!currentOwner) {
      toast.error("Please mark one player as the game owner");
      return;
    }

    const participants = [
      ...teamASlots.map((slot) => ({
        team: "a" as const,
        position_role: slot.position || "",
        is_game_owner: slot.isOwner,
        is_paid: slot.isPaid,
        user_id: slot.userId,
      })),
      ...teamBSlots.map((slot) => ({
        team: "b" as const,
        position_role: slot.position || "",
        is_game_owner: slot.isOwner,
        is_paid: slot.isPaid,
        user_id: slot.userId,
      })),
    ];

    if (participants.length === 0) {
      toast.error("At least one participant is required");
      return;
    }

    // ── Build base data ──
    const data: any = {
      court_id: selectedCourt,
      date: format(date, "yyyy-MM-dd"),
      start_time: formatSlotTime(startTime),
      end_time: formatSlotTime(endTime),
      game_format: gameFormat,
      participants,
    };

    if (isEditMode) {
      // ── EDIT MODE: Only send visibility as 'private' ──
      data.visibility = "private";
      // DO NOT send: repeat_type, payment_type, booking_type, is_competitive
    } else {
      // ── CREATE MODE: Send all fields ──
      data.booking_type = bookingType;
      data.payment_type = paymentType;
      data.repeat_type = repeatType as "none" | "weekly" | "monthly";
      data.visibility = visibility;
      data.is_competitive = isCompetitive;
    }

    setIsSubmitting(true);
    const res = editingBooking
      ? await updateBookingAction(editingBooking.id, data)
      : await createBookingAction(data);

    if (res.success) {
      toast.success(res.data.message);
      onSuccess();
    } else {
      toast.error(res.message);
    }
    setIsSubmitting(false);
  };

  const activeConfig = bookingTypeConfig[bookingType];

  const renderPlayerRow = (slot: PlayerSlot, idx: number, team: "a" | "b") => (
    <div
      key={slot.id}
      className={cn(
        "flex gap-2 items-center flex-wrap rounded-lg p-2 -mx-2 transition-colors",
        slot.isOwner && "bg-amber-50 ring-1 ring-amber-300",
      )}
    >
      <button
        type="button"
        onClick={() => handleRemovePlayer(team, idx)}
        className="text-slate-300 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
        <span className="text-slate-500 text-[10px] font-bold">#{idx + 1}</span>
      </div>
      <Input
        value={slot.name}
        readOnly
        className="flex-1 min-w-[100px] bg-slate-50 cursor-default"
      />
      <Input
        value={slot.position}
        placeholder="Position"
        className="w-24 min-w-[80px]"
        onChange={(e) => {
          const updater = (s: PlayerSlot, i: number) =>
            i === idx ? { ...s, position: e.target.value } : s;
          if (team === "a") setTeamASlots((prev) => prev.map(updater));
          else setTeamBSlots((prev) => prev.map(updater));
        }}
      />
      <Input
        value={getDisplayAmount(slot, team)}
        className="w-20 text-center"
        readOnly
      />
      <span className="text-slate-500">€</span>
      <Button
        variant={slot.isPaid ? "blue" : "outline"}
        className="px-3 text-xs h-10 shrink-0"
        onClick={() => handleTogglePaid(team, idx)}
      >
        {slot.isPaid ? "Paid" : "Unpaid"}
      </Button>
      <Button
        type="button"
        variant={slot.isOwner ? "default" : "outline"}
        size="sm"
        className={cn(
          "px-2 text-xs h-10 shrink-0 gap-1",
          slot.isOwner && "bg-amber-500 hover:bg-amber-600 border-amber-500",
        )}
        onClick={() => handleSetOwner(team, idx)}
      >
        <Crown className="w-3.5 h-3.5" />
        {slot.isOwner ? "Owner" : "Set Owner"}
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex px-6 border-b border-slate-200 bg-white items-center justify-between">
        <div className="flex gap-1 py-2">
          {(["regular", "lesson", "event"] as BookingType[]).map((type) => {
            // ── In edit mode, only show the current booking type ──
            if (isEditMode && type !== bookingType) {
              return null;
            }

            return (
              <button
                key={type}
                onClick={() => handleBookingTypeChange(type)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-colors",
                  bookingType === type
                    ? type === "event"
                      ? "bg-amber-100 text-amber-700 border border-amber-300"
                      : type === "lesson"
                        ? "bg-green-light text-green-700 border border-green-300"
                        : "bg-blue-light text-blue-700 border border-blue-300"
                    : "text-slate-500 hover:bg-slate-100",
                )}
              >
                {type === "event" ? "🏆 " : type === "lesson" ? "⚡ " : "📅 "}
                {type === "regular"
                  ? "Match"
                  : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            );
          })}
        </div>
        <div className="flex items-center text-base font-bold text-slate-800 py-2 px-3 bg-slate-100 rounded-md my-2 border border-slate-200 shadow-sm">
          <CalendarIcon className="w-4 h-4 mr-2 text-blue-500" />
          {format(date, "dd MMM yyyy")}
        </div>
      </div>

      <div className="p-6 space-y-6 flex-1 overflow-y-auto pb-32">
        {/* Slot Info Card */}
        <div
          className={cn(
            "rounded-xl p-5 text-white shadow-md relative overflow-hidden",
            activeConfig.color,
          )}
        >
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm font-medium text-white/80">
                {activeConfig.label} Slot
              </p>
              <p className="text-3xl font-black tracking-tight">
                {formatSlotTime(startTime)} - {formatSlotTime(endTime)}
              </p>
              <p className="text-sm font-medium text-white/80 mt-1">
                Duration: {durationInHours} hour{durationInHours > 1 ? "s" : ""}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-white/80">Court</p>
              <p className="text-xl font-bold">
                {currentCourt?.name ?? selectedCourt}
              </p>
              {currentCourt && (
                <p className="text-xs text-white/70">
                  {currentCourt.formats.join(" / ")} • €
                  {currentCourt.pricePerHour}/hr
                </p>
              )}
            </div>
          </div>
          <activeConfig.icon className="w-32 h-32 absolute -right-6 -bottom-6 text-white opacity-10 pointer-events-none" />
        </div>

        {/* Game Owner summary - moved to be more compact */}
        <div
          className={cn(
            "rounded-lg border px-4 py-2 flex items-center gap-2",
            currentOwner
              ? "border-amber-300 bg-amber-50"
              : "border-slate-200 bg-slate-100",
          )}
        >
          <Crown
            className={cn(
              "w-4 h-4 shrink-0",
              currentOwner ? "text-amber-600" : "text-slate-400",
            )}
          />
          {currentOwner ? (
            <span className="text-sm font-semibold text-amber-900">
              Game Owner: <span className="font-bold">{currentOwner.name}</span>
            </span>
          ) : (
            <span className="text-sm font-semibold text-slate-500">
              No game owner selected yet
            </span>
          )}
        </div>

        {/* Booking Details */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-4">
          <h3 className="font-bold text-base">Booking Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {!isEditMode && (
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  Game Format
                </label>
                <Select value={gameFormat} onValueChange={setGameFormat}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFormats.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-slate-400 mt-1">
                  (Select multiple)
                </p>
              </div>
            )}
            {!isEditMode && (
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  Payment type
                </label>
                <Select
                  value={paymentType}
                  onValueChange={handlePaymentTypeChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="split">Split</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">
                {paymentType === "single"
                  ? "Total price (paid by one player)"
                  : "Price per person"}
              </label>
              <Input
                value={
                  paymentType === "single"
                    ? totalPrice.toFixed(2)
                    : splitPricePerPerson()
                }
                readOnly
                className="bg-slate-50"
              />
              <p className="text-xs text-slate-400 mt-1">
                {paymentType === "split"
                  ? `Split among ${parseInt(gameFormat) * 2} players`
                  : "One player pays the full amount"}
              </p>
            </div>
          </div>

          {/* Row 2: Match Type + Repeat + Visibility */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${!isEditMode && "border-t border-slate-100 pt-2"} `}
          >
            {isEditMode && (
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  Game Format
                </label>
                <Select value={gameFormat} onValueChange={setGameFormat}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFormats.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-slate-400 mt-1">
                  (Select multiple)
                </p>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">
                Match Type
              </label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={isCompetitive ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setIsCompetitive(true)}
                >
                  Competitive
                </Button>
                <Button
                  type="button"
                  variant={!isCompetitive ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setIsCompetitive(false)}
                >
                  Friendly
                </Button>
              </div>
            </div>
            {!isEditMode && (
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  Repeat
                </label>
                <Select value={repeatType} onValueChange={setRepeatType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select repetition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">
                Visibility
              </label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={visibility === "private" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setVisibility("private")}
                >
                  <EyeOff className="w-4 h-4 mr-1" /> Private
                </Button>
                <Button
                  type="button"
                  variant={visibility === "public" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setVisibility("public")}
                >
                  <Eye className="w-4 h-4 mr-1" /> Public
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="space-y-4">
          <h3 className="font-bold text-base flex items-center">
            <Users className="w-5 h-5 mr-2" /> Participants
          </h3>

          {/* Team A */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
              <h4 className="text-sm font-bold text-slate-700">Team A</h4>
              <span className="text-xs text-slate-400 font-medium">
                {teamASlots.length} / players
              </span>
            </div>
            <div className="p-4 space-y-3">
              <div className="space-y-2">
                {teamASlots.map((slot, idx) => renderPlayerRow(slot, idx, "a"))}
              </div>
              <Dialog
                open={searchDialogOpen}
                onOpenChange={setSearchDialogOpen}
              >
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="text-sm text-blue-500 hover:underline font-medium"
                    onClick={() => {
                      setSelectedTeam("a");
                      setSearchDialogOpen(true);
                    }}
                  >
                    + Add Player
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Search Players</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Search by name or email..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          handleSearch(e.target.value);
                        }}
                      />
                    </div>
                    {searching ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {/* ── Customers Section ── */}
                        {searchResults.filter((u) => u.is_customer).length >
                          0 && (
                          <>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-1 bg-slate-50 rounded sticky top-0 z-10">
                              Customers
                            </div>
                            {searchResults
                              .filter((u) => u.is_customer)
                              .map((user) => (
                                <div
                                  key={user.user_id}
                                  className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer border border-slate-100"
                                  onClick={() =>
                                    handleAddPlayer(user, selectedTeam)
                                  }
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                      {user.name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="font-medium text-slate-800 flex items-center gap-1">
                                        {user.name}
                                        <span className="text-[10px] text-blue-500 font-medium bg-blue-50 px-1.5 py-0.5 rounded">
                                          ★ Customer
                                        </span>
                                      </p>
                                      <p className="text-xs text-slate-500">
                                        {user.email}
                                      </p>
                                    </div>
                                  </div>
                                  <Button size="sm" variant="outline">
                                    <UserPlus className="w-4 h-4 mr-1" /> Add
                                  </Button>
                                </div>
                              ))}
                          </>
                        )}

                        {/* ── AthlonGo Users Section ── */}
                        {searchResults.filter((u) => !u.is_customer).length >
                          0 && (
                          <>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-1 bg-slate-50 rounded mt-2 sticky top-0 z-10">
                              AthlonGo Users
                            </div>
                            {searchResults
                              .filter((u) => !u.is_customer)
                              .map((user) => (
                                <div
                                  key={user.user_id}
                                  className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer border border-slate-100"
                                  onClick={() =>
                                    handleAddPlayer(user, selectedTeam)
                                  }
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                                      {user.name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="font-medium text-slate-800">
                                        {user.name}
                                      </p>
                                      <p className="text-xs text-slate-500">
                                        {user.email}
                                      </p>
                                    </div>
                                  </div>
                                  <Button size="sm" variant="outline">
                                    <UserPlus className="w-4 h-4 mr-1" /> Add
                                  </Button>
                                </div>
                              ))}
                          </>
                        )}
                      </div>
                    ) : searchQuery.length > 1 ? (
                      <div className="text-center py-8 text-slate-500">
                        No users found
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-400 text-sm">
                        Type at least 2 characters to search
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Team B */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
              <h4 className="text-sm font-bold text-slate-700">Team B</h4>
              <span className="text-xs text-slate-400 font-medium">
                {teamBSlots.length} / players
              </span>
            </div>
            <div className="p-4 space-y-3">
              <div className="space-y-2">
                {teamBSlots.map((slot, idx) => renderPlayerRow(slot, idx, "b"))}
              </div>
              <button
                type="button"
                className="text-sm text-blue-500 hover:underline font-medium"
                onClick={() => {
                  setSelectedTeam("b");
                  setSearchDialogOpen(true);
                }}
              >
                + Add Player
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 bg-white shrink-0">
        {!currentOwner && (
          <p className="text-xs text-red-500 font-medium text-center mb-2">
            ⚠ Select a game owner to create a booking
          </p>
        )}
        <Button
          variant="blue"
          className="w-full h-12"
          onClick={handleSubmit}
          disabled={isSubmitting || !currentOwner}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {editingBooking ? "Updating..." : "Creating..."}
            </>
          ) : editingBooking ? (
            "Update Booking"
          ) : (
            "Create Booking"
          )}
        </Button>
      </div>
    </div>
  );
}