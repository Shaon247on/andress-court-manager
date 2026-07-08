'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ScheduleMaintenancePage() {
  const [schedule, setSchedule] = useState([
    { day: 'Mon', isOpen: true, open: '10:00 AM', close: '10:00 PM' },
    { day: 'Tue', isOpen: true, open: '10:00 AM', close: '10:00 PM' },
    { day: 'Wed', isOpen: true, open: '10:00 AM', close: '10:00 PM' },
    { day: 'Thu', isOpen: true, open: '10:30 AM', close: '10:00 PM' },
    { day: 'Fri', isOpen: true, open: '10:00 AM', close: '10:00 PM' },
    { day: 'Sat', isOpen: true, open: '10:00 AM', close: '10:00 PM' },
    { day: 'Sun', isOpen: true, open: '10:00 AM', close: '10:00 PM' },
  ]);

  const toggleDay = (index: number) => {
    const newSchedule = [...schedule];
    newSchedule[index].isOpen = !newSchedule[index].isOpen;
    setSchedule(newSchedule);
  };

  return (
    <div className="h-full flex flex-col p-8 bg-white overflow-y-auto w-full">
      <div className="mb-10 flex items-center shrink-0">
        <Link href="/dashboard/settings" className="p-2 border border-slate-200 bg-white mr-4 rounded-lg hover:bg-slate-50 transition-colors">
           <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Link>
        <div>
           <h1 className="text-3xl font-bold text-slate-900">Schedule Maintenance</h1>
           <p className="text-slate-500 mt-1">Weekly Time management & Open or Close Time</p>
        </div>
      </div>

      <div className="max-w-3xl pb-10">
         <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden mb-8">
            <div className="flex items-center p-6 bg-slate-50/50 border-b border-slate-200">
               <CalendarDays className="w-5 h-5 text-emerald-500 mr-3" />
               <h2 className="text-lg font-bold text-slate-900 leading-none mt-0.5">Weekly Availability Schedule</h2>
            </div>
            
            <div className="p-8 space-y-6">
               {schedule.map((slot, i) => (
                  <div key={slot.day} className="flex items-center">
                     <div className="w-16 font-bold text-slate-900">{slot.day}</div>
                     
                     <button 
                        onClick={() => toggleDay(i)}
                        className={cn(
                           "relative inline-flex h-7 w-12 items-center rounded-full transition-colors mr-6 focus:outline-none",
                           slot.isOpen ? "bg-emerald-500" : "bg-slate-300"
                        )}
                     >
                        <span className={cn(
                           "inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm",
                           slot.isOpen ? "translate-x-6" : "translate-x-1"
                        )}/>
                     </button>

                     <div className="flex items-center space-x-4 flex-1">
                        <div className="flex items-center">
                           <span className="text-sm text-slate-500 mr-3 w-10 text-right">Open:</span>
                           <Input defaultValue={slot.open} disabled={!slot.isOpen} className={cn("w-32 h-10 text-center font-medium", !slot.isOpen && "opacity-50")} />
                        </div>
                        <div className="w-4 h-px bg-slate-300"></div>
                        <div className="flex items-center">
                           <span className="text-sm text-slate-500 mr-3 w-12 text-right">Close:</span>
                           <Input defaultValue={slot.close} disabled={!slot.isOpen} className={cn("w-32 h-10 text-center font-medium", !slot.isOpen && "opacity-50")} />
                        </div>
                     </div>

                     <div className="w-20 text-right ml-4">
                        {slot.isOpen ? (
                           <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Open</span>
                        ) : (
                           <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">Closed</span>
                        )}
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="flex justify-end">
            <Button variant="primary" className="h-12 px-8 rounded-lg font-bold shadow-md">
               <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
         </div>
      </div>
    </div>
  );
}
