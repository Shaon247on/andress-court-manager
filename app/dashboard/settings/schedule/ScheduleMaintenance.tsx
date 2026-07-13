// app/dashboard/settings/schedule/ScheduleMaintenance.tsx

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CalendarDays, Save, Loader2, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { updateScheduleAction, updateCancellationAction } from '@/actions/settings.action';
import type { Schedule, DaySchedule } from '@/types/Settings.type';
import { toast } from 'sonner';

interface ScheduleMaintenanceProps {
  schedule: Schedule | null;
  cancellationHours: number;
  errorMessage?: string;
  cancellationError?: string;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ScheduleMaintenance({ 
  schedule, 
  cancellationHours: initialCancellationHours,
  errorMessage, 
  cancellationError 
}: ScheduleMaintenanceProps) {
  const router = useRouter();
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [loadingCancellation, setLoadingCancellation] = useState(false);
  
  // Initialize state directly with props - no useEffect needed
  const [scheduleData, setScheduleData] = useState<Schedule | null>(schedule);
  const [cancellationHours, setCancellationHours] = useState(initialCancellationHours || 24);

  // When props change, update state - using useEffect is still needed for prop updates
  // but we can use a different approach: update state directly when props change
  // by checking if the prop is different from current state
  React.useEffect(() => {
    if (schedule && JSON.stringify(schedule) !== JSON.stringify(scheduleData)) {
      setScheduleData(schedule);
    }
  }, [schedule]);

  React.useEffect(() => {
    if (initialCancellationHours !== cancellationHours) {
      setCancellationHours(initialCancellationHours || 24);
    }
  }, [initialCancellationHours]);

  const toggleDay = (dayIndex: number) => {
    if (!scheduleData) return;
    const dayKey = DAYS[dayIndex];
    setScheduleData({
      ...scheduleData,
      [dayKey]: {
        ...scheduleData[dayKey],
        is_open: !scheduleData[dayKey].is_open,
      },
    });
  };

  const updateTime = (dayIndex: number, field: 'open' | 'close', value: string) => {
    if (!scheduleData) return;
    const dayKey = DAYS[dayIndex];
    setScheduleData({
      ...scheduleData,
      [dayKey]: {
        ...scheduleData[dayKey],
        [field]: value,
      },
    });
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleData) return;

    setLoadingSchedule(true);
    
    // Prepare the payload
    const payload: any = {};
    DAYS.forEach((day) => {
      payload[day] = {
        is_open: scheduleData[day].is_open,
        open: scheduleData[day].open || '10:00',
        close: scheduleData[day].close || '22:00',
      };
    });

    const res = await updateScheduleAction(payload);
    if (res.success) {
      toast.success(res.data.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setLoadingSchedule(false);
  };

  const handleCancellationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingCancellation(true);

    const res = await updateCancellationAction({ cancellation_hours: cancellationHours });
    if (res.success) {
      toast.success(res.data.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setLoadingCancellation(false);
  };

  if (errorMessage || cancellationError) {
    return (
      <div className="h-full flex flex-col p-8 bg-white overflow-y-auto w-full">
        {errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
            {errorMessage}
          </div>
        )}
        {cancellationError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {cancellationError}
          </div>
        )}
      </div>
    );
  }

  if (!scheduleData) {
    return (
      <div className="h-full flex flex-col p-8 bg-white overflow-y-auto w-full">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 bg-white overflow-y-auto w-full">
      <div className="mb-6 sm:mb-10 flex items-center shrink-0">
        <Link href="/dashboard/settings" className="p-2 border border-slate-200 bg-white mr-4 rounded-lg hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Schedule Maintenance</h1>
          <p className="text-slate-500 mt-1">Weekly Time management & Open or Close Time</p>
        </div>
      </div>

      <div className="max-w-3xl pb-10 w-full space-y-6 sm:space-y-8">
        {/* Weekly Schedule Section */}
        <form onSubmit={handleScheduleSubmit}>
          <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="flex items-center p-4 sm:p-6 bg-slate-50/50 border-b border-slate-200">
              <CalendarDays className="w-5 h-5 text-emerald-500 mr-3" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-none">Weekly Availability Schedule</h2>
            </div>
            
            <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
              {DAYS.map((day, i) => (
                <div key={day} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0">
                  <div className="w-16 font-bold text-slate-900 text-sm sm:text-base">{DAY_LABELS[i]}</div>
                  
                  <button 
                    type="button"
                    onClick={() => toggleDay(i)}
                    className={cn(
                      "relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none shrink-0",
                      scheduleData[day].is_open ? "bg-emerald-500" : "bg-slate-300"
                    )}
                  >
                    <span className={cn(
                      "inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm",
                      scheduleData[day].is_open ? "translate-x-6" : "translate-x-1"
                    )}/>
                  </button>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 flex-1 ml-0 sm:ml-2">
                    <div className="flex items-center w-full sm:w-auto">
                      <span className="text-sm text-slate-500 mr-2 w-10 text-left sm:text-right">Open:</span>
                      <Input 
                        value={scheduleData[day].open || '10:00'}
                        onChange={(e) => updateTime(i, 'open', e.target.value)}
                        disabled={!scheduleData[day].is_open} 
                        className={cn("w-full sm:w-32 h-10 text-center font-medium", !scheduleData[day].is_open && "opacity-50")} 
                        placeholder="10:00"
                      />
                    </div>
                    <div className="hidden sm:block w-4 h-px bg-slate-300"></div>
                    <div className="flex items-center w-full sm:w-auto">
                      <span className="text-sm text-slate-500 mr-2 w-10 text-left sm:text-right">Close:</span>
                      <Input 
                        value={scheduleData[day].close || '22:00'}
                        onChange={(e) => updateTime(i, 'close', e.target.value)}
                        disabled={!scheduleData[day].is_open} 
                        className={cn("w-full sm:w-32 h-10 text-center font-medium", !scheduleData[day].is_open && "opacity-50")} 
                        placeholder="22:00"
                      />
                    </div>
                  </div>

                  <div className="w-20 text-right ml-0 sm:ml-4 shrink-0">
                    {scheduleData[day].is_open ? (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Open</span>
                    ) : (
                      <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">Closed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50/30 flex justify-end">
              <Button 
                type="submit" 
                variant="primary" 
                className="h-12 px-8 rounded-lg font-bold shadow-md w-full sm:w-auto"
                disabled={loadingSchedule}
              >
                {loadingSchedule ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving Schedule...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> Save Schedule
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Cancellation Policy Section */}
        <form onSubmit={handleCancellationSubmit}>
          <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="flex items-center p-4 sm:p-6 bg-slate-50/50 border-b border-slate-200">
              <Clock className="w-5 h-5 text-orange-500 mr-3" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-none">Cancellation Policy</h2>
            </div>
            
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <label className="text-sm font-medium text-slate-700">Cancellation Window (hours)</label>
                <Input
                  type="number"
                  value={cancellationHours}
                  onChange={(e) => setCancellationHours(parseInt(e.target.value) || 0)}
                  className="w-full sm:w-32 h-10 text-center font-medium"
                  min="0"
                />
                <p className="text-xs text-slate-400">Hours before booking start time that cancellation is allowed</p>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50/30 flex justify-end">
              <Button 
                type="submit" 
                variant="primary" 
                className="h-12 px-8 rounded-lg font-bold shadow-md w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
                disabled={loadingCancellation}
              >
                {loadingCancellation ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving Policy...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> Save Cancellation Policy
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}