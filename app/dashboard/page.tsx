import React from 'react';
import { ScheduleBoard } from '@/components/schedule/ScheduleBoard';

export default function DashboardPage() {
  return (
    <div className="h-full flex flex-col p-8">
      <div className="mb-6 flex flex-col space-y-1 shrink-0">
        <h1 className="text-2xl font-bold text-slate-900">Schedule Overview</h1>
        <p className="text-slate-500">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>
      
      {/* The main schedule board component with drag & drop */}
      <div className="flex-1 min-h-0 bg-white rounded-lg border border-slate-200 flex flex-col">
          <ScheduleBoard />
      </div>
    </div>
  );
}
