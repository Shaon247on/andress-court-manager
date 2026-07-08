'use client';

import React from 'react';
import Link from 'next/link';
import { Search, MoreVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const mockCourts = [
  { id: 1, name: 'Arena Pro - Court A', location: 'Athens', type: 'Football', surface: 'Artificial Turf', status: 'Close', statusType: 'Outdoor', price: '€50', rating: '4.9', reviews: 145, bookings: 145, revenue: '€18,450' },
  { id: 2, name: 'Arena Pro - Court B', location: 'Athens', type: 'Football', surface: 'Artificial Turf', status: 'Active', statusType: 'Indoor', price: '€45', rating: '4.7', reviews: 128, bookings: 128, revenue: '€15,200' },
  { id: 3, name: 'Indoor Court Premium', location: 'Athens', type: 'Football', surface: 'Artificial Turf', status: 'Close', statusType: 'Outdoor', price: '€60', rating: '4.8', reviews: 89, bookings: 89, revenue: '€11,980' },
  { id: 4, name: 'Skyline Tennis Court', location: 'Athens', type: 'Football', surface: 'Artificial Turf', status: 'Active', statusType: 'Indoor', price: '€35', rating: '4.6', reviews: 56, bookings: 56, revenue: '€6,440' },
  { id: 5, name: 'Rooftop Futsal', location: 'Athens', type: 'Football', surface: 'Artificial Turf', status: 'Active', statusType: 'Both', price: '€40', rating: '4.5', reviews: 72, bookings: 72, revenue: '€8,640' },
];

export default function CourtsPage() {
  return (
    <div className="h-full flex flex-col p-8 overflow-y-auto">
      <div className="mb-6 flex flex-col space-y-1 shrink-0">
        <h1 className="text-2xl font-bold text-slate-900">Court Management</h1>
        <p className="text-slate-500">Manage all courts and their details</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 shrink-0">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="text-sm font-medium text-slate-500 mb-2">Total Courts</div>
          <div className="text-3xl font-bold text-slate-900">4</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="text-sm font-medium text-slate-500 mb-2">Available</div>
          <div className="text-3xl font-bold text-primary">3</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="text-sm font-medium text-slate-500 mb-2">Under Maintenance</div>
          <div className="text-3xl font-bold text-orange-500">1</div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 shrink-0">
        <div className="flex space-x-4 items-center">
          <div className="w-64">
            <Input icon={<Search className="w-4 h-4"/>} placeholder="Search courts..." />
          </div>
          <div className="flex border border-slate-200 rounded-md overflow-hidden bg-white p-1">
             <button className="px-4 py-1.5 rounded text-sm font-medium bg-primary text-white">All</button>
             <button className="px-4 py-1.5 rounded text-sm font-medium text-slate-600 hover:bg-slate-100">Indoor</button>
             <button className="px-4 py-1.5 rounded text-sm font-medium text-slate-600 hover:bg-slate-100">Outdoor</button>
          </div>
        </div>

        <Link href="/dashboard/courts/new">
          <Button variant="primary" className="h-10">
            <span className="mr-2">+</span> Add Court
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Court</th>
                <th className="px-6 py-4">Type / Surface</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Price/hr</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Bookings</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockCourts.map((court) => (
                <tr key={court.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                       <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-3 shrink-0">
                         ⚽
                       </div>
                       <div>
                         <div className="font-bold text-slate-900">{court.name}</div>
                         <div className="text-xs text-slate-500">Location : {court.location}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{court.type}</div>
                    <div className="text-slate-500 text-xs">{court.surface}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1 items-start">
                       <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${court.status === 'Active' ? 'border-green-200 text-green-700 bg-green-50' : 'border-red-200 text-red-700 bg-red-50'}`}>
                         {court.status}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{court.price}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-bold">
                       {court.statusType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-900">{court.bookings}</td>
                  <td className="px-6 py-4 font-bold text-primary">{court.revenue}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreVertical className="w-5 h-5 mx-auto" />
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
