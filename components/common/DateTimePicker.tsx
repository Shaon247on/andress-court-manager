// components/common/DateTimePicker.tsx

"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
  value?: string; // ISO string or "YYYY-MM-DDTHH:mm"
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
}

/**
 * DateTimePicker
 * - Stores/returns a value in "YYYY-MM-DDTHH:mm" format (matches datetime-local)
 * - Combines Shadcn Calendar (date) + a native time input (hour/minute)
 * - Fully controlled — caller owns the value
 */
export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick date & time",
  disabled,
  className,
  minDate,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  // ── Parse incoming value ──
  const parsed = React.useMemo(() => {
    if (!value) return { date: undefined, time: "00:00" };
    const [datePart, timePart] = value.split("T");
    const [y, m, d] = datePart.split("-").map(Number);
    return {
      date: new Date(y, (m || 1) - 1, d || 1),
      time: timePart?.slice(0, 5) || "00:00",
    };
  }, [value]);

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    parsed.date
  );
  const [selectedTime, setSelectedTime] = React.useState<string>(parsed.time);

  // ── Sync when value prop changes externally ──
  React.useEffect(() => {
    setSelectedDate(parsed.date);
    setSelectedTime(parsed.time);
  }, [parsed.date, parsed.time]);

  // ── Emit changes ──
  const emit = (date?: Date, time?: string) => {
    const d = date ?? selectedDate;
    const t = time ?? selectedTime;
    if (!d || !t) return;

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    onChange(`${yyyy}-${mm}-${dd}T${t}`);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) emit(date, selectedTime);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = e.target.value;
    setSelectedTime(t);
    emit(selectedDate, t);
  };

  const displayValue = React.useMemo(() => {
    if (!selectedDate || !value) return null;
    const [y, m, d] = [
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
    ];
    const dateLabel = format(new Date(y, m, d), "PPP");
    return `${dateLabel} • ${selectedTime}`;
  }, [selectedDate, selectedTime, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-left transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            !displayValue && "text-slate-400",
            className
          )}
        >
          <span className="flex items-center gap-2 truncate">
            <CalendarIcon className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="truncate">
              {displayValue ?? placeholder}
            </span>
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col sm:flex-row">
          {/* ── Calendar ── */}
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={minDate ? { before: minDate } : undefined}
            autoFocus
          />

          {/* ── Time selector ── */}
          <div className="border-t sm:border-t-0 sm:border-l border-slate-200 p-4 flex flex-col gap-3 min-w-[160px]">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">
                Time
              </span>
            </div>
            <input
              type="time"
              value={selectedTime}
              onChange={handleTimeChange}
              className={cn(
                "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              )}
            />
            <div className="flex flex-wrap gap-1.5">
              {["09:00", "12:00", "15:00", "18:00", "21:00"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setSelectedTime(t);
                    emit(selectedDate, t);
                  }}
                  className={cn(
                    "px-2 py-1 rounded text-xs font-medium transition-colors",
                    selectedTime === t
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <Button
              type="button"
              size="sm"
              variant="primary"
              className="mt-auto"
              onClick={() => setOpen(false)}
              disabled={!selectedDate}
            >
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}