'use client';

import React, { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockBookings = [
  { id: 1, date: 'Apr 3, 2026', time: '09:00 - 10:00', court: 'Court 1', players: 'John Doe', playersCount: 1, price: '$50', paymentType: 'Single', type: 'Bookings' },
  { id: 2, date: 'Apr 3, 2026', time: '10:00 - 11:30', court: 'Court 2', players: 'Jane Smith, Mike Johnson', playersCount: 2, price: '$75', paymentType: 'Split', type: 'Lessons' },
  { id: 3, date: 'Apr 3, 2026', time: '16:00 - 17:00', court: 'Court 3', players: 'John Doe, David Brown', playersCount: 2, price: '$50', paymentType: 'Split', type: 'Lessons' },
];

export default function BookingsPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date('2026-04-03'));
  const [filterType, setFilterType] = useState('All');

  return (
    <div className="h-full flex flex-col p-8 overflow-y-auto">
      <div className="mb-6 flex flex-col space-y-1 shrink-0">
        <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
        <p className="text-slate-500">Track all bookings and lessons</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 shrink-0">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="text-sm font-medium text-slate-500 mb-2">Total Bookings</div>
          <div className="text-3xl font-bold text-slate-900">4</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="text-sm font-medium text-slate-500 mb-2">Available Slots</div>
          <div className="text-3xl font-bold text-primary">64</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="text-sm font-medium text-slate-500 mb-2">Utilization</div>
          <div className="text-3xl font-bold text-blue-600">5.9%</div>
        </div>
      </div>

      {/* Filters and Date Pager */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 shrink-0 border-b border-slate-200 pb-4">
        <div className="flex space-x-2">
          {['All', 'Bookings', 'Lessons'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filterType === type ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center flex-1 mx-4 lg:mx-12">
          <button onClick={() => setCurrentDate(subDays(currentDate, 1))} className="p-2 hover:bg-slate-100 rounded-md">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="font-bold text-slate-900 text-lg mx-4 min-w-[200px] text-center">
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </div>
          <Button variant="primary" size="sm" className="mr-4" onClick={() => setCurrentDate(new Date())}>Today</Button>
          <button onClick={() => setCurrentDate(addDays(currentDate, 1))} className="p-2 hover:bg-slate-100 rounded-md">
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
           <div className="flex items-center border border-slate-200 rounded-md px-3 py-2 bg-white">
              <CalendarIcon className="w-4 h-4 text-slate-400 mr-2" />
              <span className="text-sm text-slate-500">MM/DD/YYYY</span>
           </div>
           <div className="flex items-center border border-slate-200 rounded-md px-3 py-2 bg-white">
              <Filter className="w-4 h-4 text-slate-400 mr-2" />
              <select className="bg-transparent text-sm text-slate-700 outline-none pr-4">
                <option>All Courts</option>
                <option>Court 1</option>
                <option>Court 2</option>
              </select>
           </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Court</th>
                <th className="px-6 py-4">Players</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-slate-900 font-medium">{booking.date}</td>
                  <td className="px-6 py-4 text-slate-600">{booking.time}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {booking.court}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-900 font-medium">{booking.players}</div>
                    <div className="text-slate-500 text-xs">{booking.playersCount} player(s)</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-900 font-medium">{booking.price}</div>
                    <div className="text-slate-500 text-xs">{booking.paymentType}</div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.type === 'Lessons' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                      {booking.type}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
