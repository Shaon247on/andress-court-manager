// app/dashboard/support/TicketList.tsx

"use client";

import React, { useState } from 'react';
import { Search, ChevronDown, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { SupportTicket, SupportStatus } from '@/types/ManagerSupport.type';
import { cn } from '@/lib/utils';

interface TicketListProps {
  tickets: SupportTicket[];
  statuses: SupportStatus[];
  onTicketClick: (ticket: SupportTicket) => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    open: { label: 'Open', className: 'bg-blue-100 text-blue-700' },
    new: { label: 'New', className: 'bg-red-100 text-red-700' },
    in_progress: { label: 'In Progress', className: 'bg-orange-100 text-orange-700' },
    resolved: { label: 'Resolved', className: 'bg-green-100 text-green-700' },
  };
  const { label, className } = statusMap[status] || statusMap.open;
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${className}`}>
      {label}
    </span>
  );
};

export default function TicketList({ tickets, statuses, onTicketClick }: TicketListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ticket.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? ticket.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex-1">
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full sm:w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search tickets..."
              className="pl-9 h-10 bg-slate-50 border-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="relative">
          <button
            className="px-4 py-2 h-10 bg-white border border-slate-200 rounded-lg flex items-center shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {filterStatus ? statuses.find(s => s.value === filterStatus)?.label || 'All Status' : 'All Status'}
            <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl w-48 py-2 z-20">
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors font-medium text-slate-700"
                onClick={() => {
                  setFilterStatus('');
                  setIsDropdownOpen(false);
                }}
              >
                All Status
              </button>
              {statuses.map((status) => (
                <button
                  key={status.value}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors font-medium text-slate-700"
                  onClick={() => {
                    setFilterStatus(status.value);
                    setIsDropdownOpen(false);
                  }}
                >
                  {status.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredTickets.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-medium">No tickets found</p>
            <p className="text-sm">Try adjusting your search or filter</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white border-b border-slate-200 text-xs text-slate-500 tracking-wide font-semibold">
              <tr>
                <th className="px-4 sm:px-6 py-4">Ticket</th>
                <th className="px-4 sm:px-6 py-4">Subject</th>
                <th className="px-4 sm:px-6 py-4">Category</th>
                <th className="px-4 sm:px-6 py-4">Status</th>
                <th className="px-4 sm:px-6 py-4 hidden sm:table-cell">Created</th>
                <th className="px-4 sm:px-6 py-4 text-center">Replies</th>
                <th className="px-4 sm:px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.code} className="hover:bg-slate-50/50 transition-colors cursor-pointer">
                  <td className="px-4 sm:px-6 py-4 font-medium text-emerald-500">
                    {ticket.code}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-slate-700 font-medium max-w-[200px] truncate">
                    {ticket.subject}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-slate-600 capitalize">
                    {ticket.category}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-slate-500 hidden sm:table-cell">
                    {formatDate(ticket.created_at)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-slate-600 text-center font-medium">
                    {ticket.reply_count}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center">
                    <button
                      onClick={() => onTicketClick(ticket)}
                      className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full text-xs shadow-sm transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}