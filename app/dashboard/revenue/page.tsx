'use client';

import React from 'react';
import { Download, DollarSign, TrendingUp, Clock, Wallet } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function RevenuePage() {
  const earningsData = [
    { date: 'Apr 3, 2026', bookingId: 'b1', players: 'John Doe', amount: '$50.00', status: 'Paid' },
    { date: 'Apr 3, 2026', bookingId: 'b2', players: 'Jane Smith, Mike Johnson', amount: '$75.00', status: 'Paid' },
    { date: 'Apr 3, 2026', bookingId: 'b3', players: 'Sarah Williams', amount: '$60.00', status: 'Paid' },
    { date: 'Apr 3, 2026', bookingId: 'b4', players: 'John Doe, David Brown', amount: '$50.00', status: 'Paid' },
  ];

  const withdrawalsData = [
    { requestDate: 'Mar 28, 2026', amount: '$2500.00', status: 'Processed', processDate: 'Apr 1, 2026' },
    { requestDate: 'Apr 2, 2026', amount: '$1800.00', status: 'Pending', processDate: '—' },
  ];

  return (
    <div className="h-full flex flex-col p-8 bg-white overflow-y-auto w-full">
      <div className="mb-6 flex flex-col space-y-1 shrink-0">
        <h1 className="text-3xl font-bold text-slate-900">Revenue</h1>
        <p className="text-slate-500">View earnings and manage withdrawals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8 shrink-0">
        <div className="bg-white border text-center border-slate-200 rounded-lg p-5 flex flex-col items-start relative overflow-hidden">
          <div className="text-sm text-slate-500 font-medium mb-2">Total Earnings</div>
          <div className="text-3xl font-bold text-slate-900">$23500.00</div>
          <div className="text-xs text-slate-400 mt-2 font-medium">From 4 bookings</div>
          <DollarSign className="absolute top-5 right-5 w-5 h-5 text-emerald-500" />
        </div>

        <div className="bg-white border text-center border-slate-200 rounded-lg p-5 flex flex-col items-start relative overflow-hidden">
          <div className="text-sm text-slate-500 font-medium mb-2">Total Withdrawn</div>
          <div className="text-3xl font-bold text-teal-600">$2500.00</div>
          <div className="text-xs text-slate-400 mt-2 font-medium">1 processed withdrawal</div>
          <Wallet className="absolute top-5 right-5 w-5 h-5 text-teal-500" />
        </div>

        {/* <div className="bg-white border text-center border-slate-200 rounded-lg p-5 flex flex-col items-start relative overflow-hidden">
          <div className="text-sm text-slate-500 font-medium mb-2">Paid Amount</div>
          <div className="text-3xl font-bold text-blue-600">$2500.00</div>
          <div className="text-xs text-slate-400 mt-2 font-medium">1 paid bookings</div>
          <TrendingUp className="absolute top-5 right-5 w-5 h-5 text-blue-500" />
        </div> */}

        <div className="bg-white border text-center border-slate-200 rounded-lg p-5 flex flex-col items-start relative overflow-hidden">
          <div className="text-sm text-slate-500 font-medium mb-2">Pending Amount</div>
          <div className="text-3xl font-bold text-orange-500">$1800.00</div>
          <div className="text-xs text-slate-400 mt-2 font-medium">1 unpaid</div>
          <Clock className="absolute top-5 right-5 w-5 h-5 text-orange-500" />
        </div>

        <div className="bg-white border text-center border-slate-200 rounded-lg p-5 flex flex-col items-start relative overflow-hidden">
          <div className="text-sm text-slate-500 font-medium mb-2">Available Balance</div>
          <div className="text-3xl font-bold text-purple-600">$2390.00</div>
          <div className="text-xs text-slate-400 mt-2 font-medium">Ready to withdraw</div>
          <Download className="absolute top-5 right-5 w-5 h-5 text-purple-500" />
        </div>
      </div>

      <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-6 mb-10 shrink-0">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Request Withdrawal</h3>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Amount ($)</label>
        <div className="flex space-x-4 mb-3">
          <Input defaultValue="2390" className="flex-1 h-12 bg-white" />
          <Button className="h-12 px-8.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shrink-0">
            Request Withdrawal
          </Button>
        </div>
        <p className="text-sm text-slate-500 font-medium">Withdrawal requests are processed weekly on Mondays. Maximum withdrawal amount: $2390.00</p>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-4 shrink-0">Withdrawal Requests</h3>
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shrink-0 mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-widest font-semibold">
              <tr>
                <th className="px-6 py-4">Request Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Process Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {withdrawalsData.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5 text-slate-600 font-medium">{row.requestDate}</td>
                  <td className="px-6 py-5 font-bold text-slate-900">{row.amount}</td>
                  <td className="px-6 py-5">
                    {row.status === 'Processed' ? (
                      <span className="inline-flex px-2.5 py-1 rounded text-[11px] font-bold bg-green-100 text-green-700">
                        {row.status}
                      </span>
                    ) : (
                      <span className="inline-flex px-2.5 py-1 rounded text-[11px] font-bold bg-orange-100 text-orange-700">
                        {row.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-slate-600">{row.processDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4 shrink-0">
        <h3 className="text-xl font-bold text-slate-900">Earnings Summary</h3>
        <Button variant="primary" className="h-9 px-5 rounded-md font-semibold text-sm">See all</Button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-10 shrink-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-widest font-semibold">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Players</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {earningsData.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5 text-slate-600 font-medium">{row.date}</td>
                  <td className="px-6 py-5 text-slate-600">{row.bookingId}</td>
                  <td className="px-6 py-5 text-slate-600">{row.players}</td>
                  <td className="px-6 py-5 font-bold text-slate-900">{row.amount}</td>
                  <td className="px-6 py-5">
                    <span className="inline-flex px-2.5 py-1 rounded text-[11px] font-bold bg-green-100 text-green-700">
                      {row.status}
                    </span>
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
