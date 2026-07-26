// components/manager/schedule/ScheduleBoard.tsx

"use client";

import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useTransition,
  useCallback,
} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { format, addDays, subDays } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoreVertical,
  MousePointerClick,
  Infinity,
  Crown,
  Users,
  DollarSign,
  Euro,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { CreateBookingSheet } from "./CreateBookingSheet";
import {
  cancelBookingAction,
  updateBookingAction,
  getBookingDetailsAction,
} from "@/actions/manager-booking.action";
import type {
  ScheduleResponse,
  ScheduleBooking,
  BookingDetail,
} from "@/types/ManagerBooking.type";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  timeToHours,
  hoursToTimeString,
  parseDateString,
} from "@/lib/schedule-time";

const START_HOUR = 0;
const END_HOUR = 24;
const ROW_HEIGHT = 80;
const MOVE_THRESHOLD_PX = 6;
const SEARCH_DEBOUNCE_DELAY = 300;

interface ScheduleBoardProps {
  initialSchedule: ScheduleResponse | null;
  errorMessage?: string;
  initialDate: string;
}

interface CourtWithData {
  id: string;
  name: string;
  formats: string[];
  pricePerHour: string;
}

type BookingWithCourt = ScheduleBooking & {
  courtId: string;
  courtName: string;
};

interface MovingBooking {
  id: string;
  bookingType: ScheduleBooking["booking_type"];
  gameOwner: string;
  gameFormat?: string;
  originalCourtId: string;
  targetCourtId: string;
  originalStart: number;
  duration: number;
  currentStart: number;
  hasMoved: boolean;
}

export function ScheduleBoard({
  initialSchedule,
  errorMessage,
  initialDate,
}: ScheduleBoardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [currentDate, setCurrentDate] = useState<Date>(() =>
    parseDateString(initialDate),
  );

  // ── Search State ──
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("q") || "",
  );
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>(
    searchParams.get("q") || "",
  );
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCurrentDate(parseDateString(initialDate));
  }, [initialDate]);

  // ── Handle Search with Debounce ──
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(value);
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("q", value.trim());
      } else {
        params.delete("q");
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    }, SEARCH_DEBOUNCE_DELAY);
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // ── Define courtsData first ──
  const courtsData: CourtWithData[] = useMemo(() => {
    if (!initialSchedule) return [];
    return initialSchedule.schedule.courts.map((court) => ({
      id: court.court_id,
      name: court.court_name,
      formats: court.game_formats || [],
      pricePerHour: court.price_per_hour || "0.00",
    }));
  }, [initialSchedule]);

  // ── Define bookings ──
  const bookings: BookingWithCourt[] = useMemo(() => {
    if (!initialSchedule) return [];
    return initialSchedule.schedule.courts.flatMap((court) =>
      court.bookings.map((booking) => ({
        ...booking,
        courtId: court.court_id,
        courtName: court.court_name,
        game_format: booking.game_format || court.game_formats?.[0] || "5v5",
        price_per_hour:
          booking.price_per_hour || court.price_per_hour || "0.00",
      })),
    );
  }, [initialSchedule]);

  // ── Filter bookings based on search query ──
  const filteredBookings = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return bookings;
    }
    const query = debouncedSearchQuery.toLowerCase().trim();
    return bookings.filter((booking) => {
      const searchableText = [
        booking.game_owner,
        booking.courtName,
        booking.game_format,
        booking.court_id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchableText.includes(query);
    });
  }, [bookings, debouncedSearchQuery]);

  const [isDragging, setIsDragging] = useState(false);
  const [dragCourt, setDragCourt] = useState<string | null>(null);
  const [dragStartSlot, setDragStartSlot] = useState<number>(0);
  const [dragCurrentSlot, setDragCurrentSlot] = useState<number>(0);

  const gridCanvasRef = useRef<HTMLDivElement | null>(null);
  const courtColumnRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const movePointerStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [movingBooking, setMovingBooking] = useState<MovingBooking | null>(
    null,
  );
  const [isDraggingBooking, setIsDraggingBooking] = useState(false);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    courtId: string;
    start: number;
    end: number;
  } | null>(null);
  const [editingBooking, setEditingBooking] = useState<BookingDetail | null>(
    null,
  );

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  const navigateToDate = (date: Date) => {
    setCurrentDate(date);
    const formatted = format(date, "yyyy-MM-dd");
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", formatted);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const refreshSchedule = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [year, month, day] = e.target.value.split("-").map(Number);
      navigateToDate(new Date(year, month - 1, day));
    }
  };

  // ── Create booking by click-and-drag on empty grid space ────────────────
  const handlePointerDown = (e: React.PointerEvent, courtId: string) => {
    if (e.button !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    let slot = START_HOUR + y / ROW_HEIGHT;
    slot = Math.floor(slot * 2) / 2;
    setIsDragging(true);
    setDragCourt(courtId);
    setDragStartSlot(slot);
    setDragCurrentSlot(slot + 0.5);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent, courtId: string) => {
    if (!isDragging || dragCourt !== courtId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    let slot = START_HOUR + y / ROW_HEIGHT;
    slot = Math.floor(slot * 2) / 2;
    setDragCurrentSlot(slot > dragStartSlot ? slot + 0.5 : slot);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    const start = Math.min(dragStartSlot, dragCurrentSlot);
    let end = Math.max(dragStartSlot, dragCurrentSlot);
    if (start === end) end = start + 0.5;
    setSelectedSlot({ courtId: dragCourt!, start, end });
    setEditingBooking(null);
    setSheetOpen(true);
    setDragCourt(null);
  };

  // ── Drag an existing booking to reschedule it (time AND court) ──────────
  const handleBookingPointerDown = (
    e: React.PointerEvent,
    booking: BookingWithCourt,
  ) => {
    e.stopPropagation();
    if (e.button !== 0) return;

    const target = e.target as HTMLElement;
    if (
      target.closest('[role="menuitem"]') ||
      target.closest('[data-state="open"]')
    )
      return;

    const start = timeToHours(booking.start_time);
    const end = timeToHours(booking.end_time);
    movePointerStart.current = { x: e.clientX, y: e.clientY };
    setIsDraggingBooking(true);
    setMovingBooking({
      id: booking.id,
      bookingType: booking.booking_type,
      gameOwner: booking.game_owner,
      gameFormat: booking.game_format,
      originalCourtId: booking.courtId,
      targetCourtId: booking.courtId,
      originalStart: start,
      duration: end - start,
      currentStart: start,
      hasMoved: false,
    });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleBookingPointerMove = (e: React.PointerEvent) => {
    if (!movingBooking || !isDraggingBooking) return;

    const dx = e.clientX - movePointerStart.current.x;
    const dy = e.clientY - movePointerStart.current.y;
    if (!movingBooking.hasMoved && Math.hypot(dx, dy) < MOVE_THRESHOLD_PX)
      return;

    let hoveredCourtId = movingBooking.targetCourtId;
    let hoveredEl: HTMLDivElement | null = null;
    for (const [courtId, el] of courtColumnRefs.current.entries()) {
      const rect = el.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right) {
        hoveredCourtId = courtId;
        hoveredEl = el;
        break;
      }
    }
    if (!hoveredEl) {
      hoveredEl =
        courtColumnRefs.current.get(movingBooking.targetCourtId) ?? null;
    }
    if (!hoveredEl) return;

    const rect = hoveredEl.getBoundingClientRect();
    const y = e.clientY - rect.top;
    let newStart = START_HOUR + Math.floor((y / ROW_HEIGHT) * 2) / 2;
    newStart = Math.max(
      START_HOUR,
      Math.min(END_HOUR - movingBooking.duration, newStart),
    );

    setMovingBooking((prev) =>
      prev
        ? {
            ...prev,
            currentStart: newStart,
            targetCourtId: hoveredCourtId,
            hasMoved: true,
          }
        : null,
    );
  };

  const handleBookingPointerUp = async (e: React.PointerEvent) => {
    if (!movingBooking || !isDraggingBooking) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    const {
      id,
      hasMoved,
      currentStart,
      duration,
      originalStart,
      originalCourtId,
      targetCourtId,
    } = movingBooking;
    setIsDraggingBooking(false);
    setMovingBooking(null);

    if (!hasMoved) {
      handleEditBooking(id, originalCourtId);
      return;
    }

    const courtChanged = targetCourtId !== originalCourtId;
    const timeChanged = Math.abs(currentStart - originalStart) > 0.25;

    if (!courtChanged && !timeChanged) {
      return;
    }

    const newStart = Math.max(
      START_HOUR,
      Math.min(END_HOUR - duration, currentStart),
    );
    const newEnd = newStart + duration;

    // ── Build update payload with ONLY changed fields ──
    const finalPayload: any = {};

    if (courtChanged) {
      const targetCourt = courtsData.find((c) => c.id === targetCourtId);
      const bookingFormat = movingBooking.gameFormat || "5v5";
      const supportsFormat = targetCourt?.formats.includes(bookingFormat);

      if (!supportsFormat) {
        toast.error(
          `"${targetCourt?.name}" does not support ${bookingFormat} format`,
        );
        return;
      }

      finalPayload.court_id = targetCourtId;
    }

    if (timeChanged) {
      finalPayload.start_time = hoursToTimeString(newStart);
      finalPayload.end_time = hoursToTimeString(newEnd);
    }

    // ── DO NOT include payment_type and repeat_type ──
    // They should NOT be sent during drag operations

    console.log("🔄 Moving booking:", {
      bookingId: id,
      courtChanged,
      timeChanged,
      finalPayload,
    });

    // ── Update booking with ONLY court/time changes ──
    const res = await updateBookingAction(id, finalPayload);
    console.log("the response::", res);
    if (res.success) {
      const targetCourt = courtsData.find((c) => c.id === targetCourtId);
      let message = "Booking updated successfully";
      if (courtChanged && timeChanged) {
        message = `Booking moved to "${targetCourt?.name}" and time updated`;
      } else if (courtChanged) {
        message = `Booking moved to "${targetCourt?.name}"`;
      } else if (timeChanged) {
        message = "Booking time updated";
      }
      toast.success(message);
      refreshSchedule();
    } else {
      // ── Handle the error message from the API ──
      const errorMessage = res.message || "Failed to update booking";

      // ── Show appropriate toast message ──
      if (errorMessage.toLowerCase().includes("already booked")) {
        const courtName =
          courtsData.find((c) => c.id === targetCourtId)?.name || "This court";
        toast.error(
          `${courtName} is already booked at that time. Please choose a different time or court.`,
        );
      } else if (errorMessage.toLowerCase().includes("overlap")) {
        toast.error(
          "This time slot overlaps with an existing booking. Please choose a different time.",
        );
      } else if (errorMessage.toLowerCase().includes("format")) {
        toast.error("This court does not support the selected game format.");
      } else if (
        errorMessage.toLowerCase().includes("maintenance") ||
        errorMessage.toLowerCase().includes("closed")
      ) {
        toast.error("This court is currently under maintenance or closed.");
      } else {
        toast.error(errorMessage);
      }
    }
  };
  const handleEditBooking = async (bookingId: string, courtId: string) => {
    const res = await getBookingDetailsAction(bookingId);
    if (res.success) {
      const b = res.data.booking;
      setEditingBooking(b);
      setSelectedSlot({
        courtId,
        start: timeToHours(b.start_time),
        end: timeToHours(b.end_time),
      });
      setSheetOpen(true);
    } else {
      toast.error(res.message);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    const res = await cancelBookingAction(bookingId);
    if (res.success) {
      toast.success(res.data.message);
      setIsCancelModalOpen(false);
      setBookingToCancel(null);
      refreshSchedule();
    } else {
      toast.error(res.message);
    }
  };

  const requestCancel = (id: string) => {
    setBookingToCancel(id);
    setIsCancelModalOpen(true);
  };

  const handleSheetClose = () => {
    setSheetOpen(false);
    setEditingBooking(null);
    setSelectedSlot(null);
  };

  const formatTimeLabel = (h: number) => `${h.toString().padStart(2, "0")}:00`;

  const getBookingColor = (bookingType: ScheduleBooking["booking_type"]) => {
    if (bookingType === "lesson")
      return "bg-green-light border-green-border text-green-dark";
    if (bookingType === "event")
      return "bg-amber-100 border-amber-300 text-amber-900";
    return "bg-blue-light border-blue-200 text-slate-800";
  };

  const getBookingTypeLabel = (type: string) => {
    if (type === "regular") return "Match";
    if (type === "lesson") return "Lesson";
    if (type === "event") return "Event";
    return type;
  };

  const ghost = useMemo(() => {
    if (!movingBooking || !isDraggingBooking || !movingBooking.hasMoved)
      return null;
    const containerEl = gridCanvasRef.current;
    const colEl = courtColumnRefs.current.get(movingBooking.targetCourtId);
    if (!containerEl || !colEl) return null;

    const containerRect = containerEl.getBoundingClientRect();
    const colRect = colEl.getBoundingClientRect();

    const left = colRect.left - containerRect.left + containerEl.scrollLeft;
    const top =
      colRect.top -
      containerRect.top +
      containerEl.scrollTop +
      (movingBooking.currentStart - START_HOUR) * ROW_HEIGHT;

    return {
      left,
      top,
      width: colRect.width,
      height: movingBooking.duration * ROW_HEIGHT,
    };
  }, [movingBooking, isDraggingBooking]);

  // ── Get filtered bookings for display ──
  const displayBookings = debouncedSearchQuery.trim()
    ? filteredBookings
    : bookings;

  if (errorMessage) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{errorMessage}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      {isPending && (
        <div className="absolute inset-0 z-40 bg-white/60 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      <div className="p-4 flex items-center justify-between border-b border-slate-200 shrink-0 flex-wrap gap-2 lg:gap-0">
        <div className="flex items-center space-x-4 w-full md:w-1/4">
          <div className="flex-1">
            <div className="relative">
              <Input
                placeholder="Search by owner, court, or format..."
                className="pl-9"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex items-center jen space-x-2 md:space-x-4 flex-wrap">
          <div className="flex items-center jen space-x-2 md:space-x-4 flex-wrap lg:ml-30">
            <button
              onClick={() => navigateToDate(subDays(currentDate, 1))}
              className="p-2 hover:bg-slate-100 rounded-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="font-bold text-slate-800 w-48 text-center shrink-0">
              {format(currentDate, "EEEE, MMMM d, yyyy")}
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigateToDate(new Date())}
            >
              Today
            </Button>
            <button
              onClick={() => navigateToDate(addDays(currentDate, 1))}
              className="p-2 hover:bg-slate-100 rounded-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="w-40 ml-10">
            <Input
              type="date"
              value={format(currentDate, "yyyy-MM-dd")}
              onChange={handleDateChange}
            />
          </div>
        </div>
        <div className="w-auto lg:w-80" />
      </div>

      <div className="px-4 py-2 flex items-center space-x-6 text-sm border-b border-slate-200 shrink-0 text-slate-600 font-medium overflow-x-auto">
        <div className="flex items-center space-x-2 shrink-0">
          <div className="w-4 h-4 rounded bg-blue-light border border-blue-200"></div>
          <span>Match</span>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <div className="w-4 h-4 rounded bg-green-light border border-green-border"></div>
          <span>Lesson</span>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <div className="w-4 h-4 rounded bg-amber-100 border border-amber-300"></div>
          <span>Event</span>
        </div>
        {debouncedSearchQuery && (
          <div className="flex items-center space-x-2 shrink-0 text-blue-600">
            <span>•</span>
            <span>Search results: {filteredBookings.length} found</span>
          </div>
        )}
      </div>

      {/* Grid Canvas */}
      <div
        ref={gridCanvasRef}
        className="flex-1 overflow-auto flex relative bg-transparent z-0"
      >
        <div className="w-16 min-h-500 md:w-20 shrink-0 border-r border-slate-200 bg-white z-10 sticky left-0 text-xs md:text-sm font-medium text-slate-500 select-none">
          <div className="h-12 border-b border-slate-200 flex items-center px-2 md:px-4 font-bold text-slate-800">
            Time
          </div>
          {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => (
            <div
              key={i}
              className="px-2 md:px-4 flex items-start pt-2 border-b border-slate-100"
              style={{ height: `${ROW_HEIGHT}px` }}
            >
              {formatTimeLabel(START_HOUR + i)}
            </div>
          ))}
        </div>

        <div className="flex-1 flex min-w-[800px] min-h-500 select-none">
          {courtsData.map((court, index) => {
            const isDropTarget =
              movingBooking?.hasMoved &&
              movingBooking.targetCourtId === court.id &&
              isDraggingBooking;
            return (
              <div
                key={court.id}
                className={cn(
                  "flex flex-col flex-1 border-r border-slate-200",
                  index === courtsData.length - 1 ? "border-r-0" : "",
                )}
              >
                <div
                  className={cn(
                    "h-12 border-b flex items-center px-4 sticky top-0 z-10 font-bold text-slate-800 shrink-0 relative transition-colors",
                    isDropTarget
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white border-slate-200",
                  )}
                >
                  {court.name}
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    {court.formats.join("/")}
                  </span>
                  <span className="ml-2 text-xs font-normal text-green-600">
                    €{court.pricePerHour}/hr
                  </span>
                </div>
                <div
                  ref={(el) => {
                    if (el) courtColumnRefs.current.set(court.id, el);
                    else courtColumnRefs.current.delete(court.id);
                  }}
                  className={cn(
                    "flex-1 relative calendar-grid cursor-pointer touch-none transition-colors",
                    isDropTarget ? "bg-blue-50/40" : "bg-white",
                  )}
                  onPointerDown={(e) => handlePointerDown(e, court.id)}
                  onPointerMove={(e) => handlePointerMove(e, court.id)}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  style={{
                    height: `${(END_HOUR - START_HOUR) * ROW_HEIGHT}px`,
                  }}
                >
                  <div className="absolute top-2 left-0 right-0 flex items-center justify-center z-0 pointer-events-none">
                    <div className="flex items-center gap-1.5 text-slate-400 opacity-40">
                      <MousePointerClick className="w-4 h-4" />
                      <span className="text-xs font-medium">Click & Drag</span>
                    </div>
                  </div>

                  {displayBookings
                    .filter((b) => b.courtId === court.id)
                    .map((booking) => {
                      const isSource =
                        movingBooking?.id === booking.id &&
                        isDraggingBooking &&
                        movingBooking.hasMoved;
                      const startHour = timeToHours(booking.start_time);
                      const endHour = timeToHours(booking.end_time);
                      const top = (startHour - START_HOUR) * ROW_HEIGHT;
                      const height = (endHour - startHour) * ROW_HEIGHT;

                      // Calculate if this is a short booking (30 minutes or less)
                      const isShortBooking = height <= 40;
                      const isMediumBooking = height > 40 && height <= 60;

                      // Extract player count from participants or use default
                      const totalPlayers = booking.participants?.length || 0;

                      // Calculate paid count from participants
                      const paidPlayers =
                        booking.participants?.filter((p) => p.is_paid).length ||
                        0;

                      // Parse total amount
                      const totalAmount = parseFloat(
                        booking.total_amount || "0",
                      );

                      // Determine if booking is recurring
                      const isRecurring =
                        booking.repeat_type && booking.repeat_type !== "none";

                      // Determine text sizes based on card height
                      const getTextSizes = () => {
                        if (isShortBooking) {
                          return {
                            owner: "text-xs",
                            time: "text-[10px]",
                            details: "text-[9px]",
                            icon: "w-2.5 h-2.5",
                            padding: "p-1",
                            gap: "gap-0.5",
                          };
                        } else if (isMediumBooking) {
                          return {
                            owner: "text-xs",
                            time: "text-[10px]",
                            details: "text-[10px]",
                            icon: "w-3 h-3",
                            padding: "p-1.5",
                            gap: "gap-1",
                          };
                        } else {
                          return {
                            owner: "text-sm",
                            time: "text-xs",
                            details: "text-[10px]",
                            icon: "w-3 h-3",
                            padding: "p-2",
                            gap: "gap-1",
                          };
                        }
                      };

                      const sizes = getTextSizes();

                      return (
                        <div
                          key={booking.id}
                          onPointerDown={(e) =>
                            handleBookingPointerDown(e, booking)
                          }
                          onPointerMove={handleBookingPointerMove}
                          onPointerUp={handleBookingPointerUp}
                          onPointerCancel={handleBookingPointerUp}
                          className={cn(
                            "absolute left-1 right-1 rounded-md border cursor-grab active:cursor-grabbing transition-opacity overflow-hidden z-20 shadow-sm hover:shadow-md group touch-none",
                            getBookingColor(booking.booking_type),
                            isSource && "opacity-30",
                            sizes.padding,
                          )}
                          style={{
                            top: `${top}px`,
                            height: `${height}px`,
                            minHeight: `${Math.min(30, height)}px`,
                          }}
                        >
                          <div className="flex flex-col h-full">
                            {/* Top row: Owner name + icons */}
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-0.5 min-w-0 flex-1">
                                <span
                                  className={cn(
                                    "font-semibold leading-tight truncate flex items-center gap-0.5",
                                    sizes.owner,
                                  )}
                                >
                                  {booking.game_owner || "Booking"}

                                  {/* Crown icon */}
                                  {!isShortBooking && (
                                    <Crown
                                      className={cn(
                                        "text-amber-500 fill-amber-400 shrink-0",
                                        sizes.icon,
                                      )}
                                    />
                                  )}

                                  {/* ── LOOP ICON FOR RECURRING BOOKINGS ── */}
                                </span>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  asChild
                                  onClick={(e) => e.stopPropagation()}
                                  onPointerDown={(e) => e.stopPropagation()}
                                >
                                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-black/10 rounded shrink-0">
                                    <MoreVertical
                                      className={cn("shrink-0", sizes.icon)}
                                    />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-48"
                                >
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditBooking(
                                        booking.id,
                                        booking.courtId,
                                      );
                                    }}
                                  >
                                    Edit Booking
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      requestCancel(booking.id);
                                    }}
                                  >
                                    Cancel Booking
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            {/* Middle: Time and format */}
                            {!isShortBooking ? (
                              <div
                                className={cn(
                                  "leading-tight opacity-80",
                                  sizes.time,
                                )}
                              >
                                <span className="font-medium">
                                  {hoursToTimeString(startHour)} -{" "}
                                  {hoursToTimeString(endHour)}
                                </span>
                                {booking.game_format && (
                                  <span className="ml-1">
                                    • {booking.game_format}
                                  </span>
                                )}
                                {!isMediumBooking && (
                                  <span className="ml-1">
                                    •{" "}
                                    {getBookingTypeLabel(booking.booking_type)}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div
                                className={cn(
                                  "leading-tight opacity-80",
                                  sizes.time,
                                )}
                              >
                                {hoursToTimeString(startHour)} -{" "}
                                {hoursToTimeString(endHour)}
                              </div>
                            )}

                            <div className="flex items-">
                              {/* Bottom: Player count and amount */}
                              {!isShortBooking && height > 35 && (
                                <div
                                  className={cn(
                                    "flex items-center gap-2 opacity-70 mt-auto pt-0.5",
                                    sizes.details,
                                  )}
                                >
                                  {totalPlayers > 0 && (
                                    <span className="flex items-center gap-0.5">
                                      <Users className={sizes.icon} />
                                      {totalPlayers}
                                    </span>
                                  )}
                                  {totalAmount > 0 && (
                                    <span className="flex items-center gap-0.5">
                                      <Euro className={sizes.icon} />
                                      {totalAmount.toFixed(0)}
                                    </span>
                                  )}
                                  {paidPlayers > 0 &&
                                    paidPlayers < totalPlayers && (
                                      <span className="text-yellow-600 text-[9px]">
                                        {paidPlayers}/{totalPlayers} paid
                                      </span>
                                    )}
                                  {paidPlayers === totalPlayers &&
                                    totalPlayers > 0 && (
                                      <span className="text-green-600 text-[9px]">
                                        ✓ All paid
                                      </span>
                                    )}
                                  {paidPlayers === 0 && totalPlayers > 0 && (
                                    <span className="text-slate-400 text-[9px]">
                                      Unpaid
                                    </span>
                                  )}
                                  <div>
                                    {booking.repeat_type !== "none" && (
                                      <span
                                        className={cn(
                                          "flex items-center gap-0.5 text-blue-500 px-1 py-0.5 rounded shrink-0",
                                          isShortBooking ? "px-0.5" : "px-1",
                                        )}
                                      >
                                        <Infinity
                                          className={cn("shrink-0 size-4")}
                                        />
                                        <span
                                          className={cn("font-medium text-sm")}
                                        >
                                          {booking.repeat_type === "weekly"
                                            ? "W"
                                            : "M"}
                                        </span>
                                      </span>
                                    )} 
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Payment type badge */}
                            {!isShortBooking &&
                              height > 50 &&
                              booking.payment_type && (
                                <div className="absolute bottom-1 right-2">
                                  <span
                                    className={cn(
                                      "font-medium bg-white/30 px-1.5 py-0.5 rounded",
                                      sizes.details,
                                    )}
                                  >
                                    {booking.payment_type === "split"
                                      ? "Split"
                                      : "Single"}
                                  </span>
                                </div>
                              )}

                            {/* Booking type badge for short bookings */}
                            {isShortBooking && (
                              <div className="absolute bottom-0.5 right-1">
                                <span className="text-[7px] font-medium bg-white/30 px-1 py-0.5 rounded">
                                  {getBookingTypeLabel(
                                    booking.booking_type,
                                  ).slice(0, 3)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                  {isDragging && dragCourt === court.id && (
                    <div
                      className="absolute left-1 right-1 bg-blue-500/20 border-2 border-blue-500 rounded-md pointer-events-none z-30"
                      style={{
                        top: `${(Math.min(dragStartSlot, dragCurrentSlot) - START_HOUR) * ROW_HEIGHT}px`,
                        height: `${Math.max(0.5, Math.abs(dragCurrentSlot - dragStartSlot)) * ROW_HEIGHT}px`,
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Ghost preview */}
        {ghost && movingBooking && isDraggingBooking && (
          <div
            className={cn(
              "absolute rounded-md border-2 border-blue-500 p-2 overflow-hidden z-50 shadow-lg pointer-events-none",
              getBookingColor(movingBooking.bookingType),
            )}
            style={{
              left: ghost.left,
              top: ghost.top,
              width: ghost.width,
              height: ghost.height,
            }}
          >
            <div className="font-semibold text-sm leading-tight truncate">
              {movingBooking.gameOwner || "Booking"}
            </div>
            <div className="text-xs mt-1 opacity-80">
              {hoursToTimeString(movingBooking.currentStart)} -{" "}
              {hoursToTimeString(
                movingBooking.currentStart + movingBooking.duration,
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Booking — right-side sheet with higher z-index */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl p-0 flex flex-col h-full gap-0 z-50"
        >
          <SheetHeader className="border-b border-slate-200 px-6 py-4 shrink-0">
            <SheetTitle>
              {editingBooking ? "Edit Booking" : "Create Booking"}
            </SheetTitle>
            <SheetDescription>
              {editingBooking
                ? "Update the booking details below"
                : "Fill in the details to create a new booking"}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            {selectedSlot && (
              <CreateBookingSheet
                isOpen={sheetOpen}
                onClose={handleSheetClose}
                selectedCourt={selectedSlot.courtId}
                startTime={selectedSlot.start}
                endTime={selectedSlot.end}
                date={currentDate}
                editingBooking={editingBooking}
                courtsData={courtsData}
                onSuccess={() => {
                  refreshSchedule();
                  handleSheetClose();
                }}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Cancel Booking Modal */}
      <AnimatePresence>
        {isCancelModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsCancelModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg p-6 shadow-xl w-full max-w-sm relative z-10"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Cancel Booking
                </h3>
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-slate-600 mb-6">
                Are you sure you want to cancel this booking?
                <br />
                This action cannot be undone.
              </p>
              <div className="flex space-x-3 justify-end items-center">
                <Button
                  variant="secondary"
                  onClick={() => setIsCancelModalOpen(false)}
                >
                  Keep Booking
                </Button>
                <Button
                  variant="danger"
                  onClick={() =>
                    bookingToCancel && handleCancelBooking(bookingToCancel)
                  }
                >
                  Cancel Booking
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
