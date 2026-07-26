"use client";

import React from 'react';
import { CalendarDays, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { RegistrationSchedule } from '@/types/Registration.type';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface ScheduleStepErrors {
  schedule?: Partial<Record<keyof RegistrationSchedule, { open?: string; close?: string }>>;
  cancellationHours?: string;
}

interface ScheduleStepProps {
  schedule: RegistrationSchedule;
  cancellationHours: number;
  errors?: ScheduleStepErrors;
  onScheduleChange: (schedule: RegistrationSchedule) => void;
  onCancellationChange: (hours: number) => void;
  onDayFieldBlur?: (day: keyof RegistrationSchedule, field: 'open' | 'close', value: string) => void;
  onCancellationBlur?: (value: number) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function ScheduleStep({
  schedule,
  cancellationHours,
  errors,
  onScheduleChange,
  onCancellationChange,
  onDayFieldBlur,
  onCancellationBlur,
  onNext,
  onPrevious,
}: ScheduleStepProps) {
  const toggleDay = (dayIndex: number) => {
    const dayKey = DAYS[dayIndex];
    onScheduleChange({
      ...schedule,
      [dayKey]: {
        ...schedule[dayKey],
        is_open: !schedule[dayKey].is_open,
      },
    });
  };

  const updateTime = (dayIndex: number, field: 'open' | 'close', value: string) => {
    const dayKey = DAYS[dayIndex];
    onScheduleChange({
      ...schedule,
      [dayKey]: {
        ...schedule[dayKey],
        [field]: value,
      },
    });
  };

  const handleCancellationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onCancellationChange(value);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="space-y-6">
        {/* Weekly Schedule Section */}
        <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="flex items-center p-4 sm:p-6 bg-slate-50/50 border-b border-slate-200">
            <CalendarDays className="w-5 h-5 text-emerald-500 mr-3" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-none">Weekly Availability Schedule</h2>
          </div>
          
          <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {DAYS.map((day, i) => {
              const dayErrors = errors?.schedule?.[day];
              return (
                <div key={day} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0">
                  <div className="w-16 font-bold text-slate-900 text-sm sm:text-base pt-2 sm:pt-0">{DAY_LABELS[i]}</div>

                  <button
                    type="button"
                    onClick={() => toggleDay(i)}
                    className={cn(
                      "relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none shrink-0",
                      schedule[day].is_open ? "bg-emerald-500" : "bg-slate-300"
                    )}
                  >
                    <span className={cn(
                      "inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm",
                      schedule[day].is_open ? "translate-x-6" : "translate-x-1"
                    )}/>
                  </button>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 flex-1 ml-0 sm:ml-2">
                    <div className="flex flex-col w-full sm:w-auto">
                      <div className="flex items-center w-full sm:w-auto">
                        <span className="text-sm text-slate-500 mr-2 w-10 text-left sm:text-right">Open:</span>
                        <Input
                          value={schedule[day].open || '10:00'}
                          onChange={(e) => updateTime(i, 'open', e.target.value)}
                          onBlur={(e) => onDayFieldBlur?.(day, 'open', e.target.value)}
                          disabled={!schedule[day].is_open}
                          className={cn(
                            "w-full sm:w-32 h-10 text-center font-medium",
                            !schedule[day].is_open && "opacity-50",
                            dayErrors?.open && "border-red-400 focus-visible:ring-red-400"
                          )}
                          placeholder="10:00"
                        />
                      </div>
                      {dayErrors?.open && (
                        <p className="text-xs text-red-500 font-medium mt-1 sm:ml-12">{dayErrors.open}</p>
                      )}
                    </div>
                    <div className="hidden sm:block w-4 h-px bg-slate-300"></div>
                    <div className="flex flex-col w-full sm:w-auto">
                      <div className="flex items-center w-full sm:w-auto">
                        <span className="text-sm text-slate-500 mr-2 w-10 text-left sm:text-right">Close:</span>
                        <Input
                          value={schedule[day].close || '22:00'}
                          onChange={(e) => updateTime(i, 'close', e.target.value)}
                          onBlur={(e) => onDayFieldBlur?.(day, 'close', e.target.value)}
                          disabled={!schedule[day].is_open}
                          className={cn(
                            "w-full sm:w-32 h-10 text-center font-medium",
                            !schedule[day].is_open && "opacity-50",
                            dayErrors?.close && "border-red-400 focus-visible:ring-red-400"
                          )}
                          placeholder="22:00"
                        />
                      </div>
                      {dayErrors?.close && (
                        <p className="text-xs text-red-500 font-medium mt-1 sm:ml-12">{dayErrors.close}</p>
                      )}
                    </div>
                  </div>

                  <div className="w-20 text-right ml-0 sm:ml-4 shrink-0">
                    {schedule[day].is_open ? (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Open</span>
                    ) : (
                      <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">Closed</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 sm:p-4 bg-slate-50/30 border-t border-slate-200 text-xs text-slate-500">
            <span className="font-medium">Tip:</span> Set your operating hours for each day. Toggle the switch to mark a day as closed.
          </div>
        </div>

        {/* Cancellation Policy Section */}
        <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="flex items-center p-4 sm:p-6 bg-slate-50/50 border-b border-slate-200">
            <Clock className="w-5 h-5 text-orange-500 mr-3" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-none">Cancellation Policy</h2>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <label className="text-sm font-medium text-slate-700">Cancellation Window (hours)</label>
              <div className="flex flex-col">
                <Input
                  type="number"
                  value={cancellationHours}
                  onChange={handleCancellationChange}
                  onBlur={(e) => onCancellationBlur?.(parseInt(e.target.value) || 0)}
                  className={cn(
                    "w-full sm:w-32 h-10 text-center font-medium",
                    errors?.cancellationHours && "border-red-400 focus-visible:ring-red-400"
                  )}
                  min="0"
                />
                {errors?.cancellationHours && (
                  <p className="text-xs text-red-500 font-medium mt-1">{errors.cancellationHours}</p>
                )}
              </div>
              <p className="text-xs text-slate-400">Hours before booking start time that cancellation is allowed</p>
            </div>
          </div>

          <div className="p-3 sm:p-4 bg-slate-50/30 border-t border-slate-200 text-xs text-slate-500">
            <span className="font-medium">Note:</span> This policy will apply to all bookings made at your facility.
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 mt-6 border-t border-slate-100">
        <Button
          variant="outline"
          className="h-12 px-8 rounded-xl font-bold text-slate-600 border-slate-200 hover:bg-slate-50"
          onClick={onPrevious}
        >
          <ChevronLeft className="w-5 h-5 mr-2" /> Previous
        </Button>
        <Button
          className="h-12 px-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base shadow-sm"
          onClick={onNext}
        >
          Next <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}