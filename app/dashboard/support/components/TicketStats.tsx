// app/dashboard/support/TicketStats.tsx

"use client";

import React from 'react';
import type { SupportTicket } from '@/types/ManagerSupport.type';

interface TicketStatsProps {
  tickets: SupportTicket[];
}

export default function TicketStats({ tickets }: TicketStatsProps) {
  const total = tickets.length;
  const open = tickets.filter(t => t.status === 'open').length;
  const inProgress = tickets.filter(t => t.status === 'in_progress').length;
  const resolved = tickets.filter(t => t.status === 'resolved').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 shrink-0">
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 flex flex-col">
        <div className="text-xs sm:text-sm text-slate-500 font-medium mb-1 sm:mb-3">Total Tickets</div>
        <div className="text-2xl sm:text-3xl font-bold text-slate-900">{total}</div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 flex flex-col">
        <div className="text-xs sm:text-sm text-slate-500 font-medium mb-1 sm:mb-3">Open</div>
        <div className="text-2xl sm:text-3xl font-bold text-red-500">{open}</div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 flex flex-col">
        <div className="text-xs sm:text-sm text-slate-500 font-medium mb-1 sm:mb-3">In Progress</div>
        <div className="text-2xl sm:text-3xl font-bold text-orange-400">{inProgress}</div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 flex flex-col">
        <div className="text-xs sm:text-sm text-slate-500 font-medium mb-1 sm:mb-3">Resolved</div>
        <div className="text-2xl sm:text-3xl font-bold text-emerald-500">{resolved}</div>
      </div>
    </div>
  );
}