// app/dashboard/support/components/ManagerSupportClient.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ArrowLeft, Send, Paperclip, MessageSquare, Mail, Phone, FileText, Shield, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSupportSocket } from '@/hooks/useSupportSocket';
import type { SupportTicket, SupportCategory, SupportStatus, SocketTicketEvent } from '@/types/ManagerSupport.type';
import { toast } from 'sonner';

// Import sub-components
import FAQSection from './FAQSection';
import DirectContactSection from './DirectContactSection';
import ResourcesSection from './ResourcesSection';
import CreateTicketForm from './CreateTicketForm';
import TicketStats from './TicketStats';
import TicketList from './TicketList';
import TicketDetail from './TicketDetail';

interface ManagerSupportClientProps {
  initialTickets: SupportTicket[];
  categories: SupportCategory[];
  statuses: SupportStatus[];
  errorMessage?: string;
}

export default function ManagerSupportClient({
  initialTickets,
  categories,
  statuses,
  errorMessage,
}: ManagerSupportClientProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const { isConnected: socketConnected } = useSupportSocket({
    ticketCode: activeTicket?.code,
    onReply: (data) => {
      setTickets(prev => prev.map(t => 
        t.code === data.ticket_code 
          ? { ...t, reply_count: t.reply_count + 1, status: data.status as any }
          : t
      ));
    },
    onStatus: (data) => {
      setTickets(prev => prev.map(t => 
        t.code === data.code 
          ? { ...t, status: data.status as any, locked: data.locked }
          : t
      ));
      if (activeTicket && data.code === activeTicket.code) {
        setActiveTicket(prev => prev ? { ...prev, status: data.status as any, locked: data.locked } : null);
      }
    },
    onNewTicket: (ticket: SocketTicketEvent) => {
      if (ticket.opened_by_staff) {
        const newTicket: SupportTicket = {
          code: ticket.code,
          subject: ticket.subject,
          category: ticket.category,
          status: ticket.status as SupportTicket['status'],
          locked: false,
          created_at: ticket.created_at,
          updated_at: ticket.created_at,
          reply_count: 0,
        };
        setTickets(prev => [newTicket, ...prev]);
        toast.info(`New ticket: ${ticket.subject}`);
      }
    },
  });

  useEffect(() => {
    setIsConnected(socketConnected);
  }, [socketConnected]);

  useEffect(() => {
    setTickets(initialTickets);
  }, [initialTickets]);

  if (errorMessage) {
    return (
      <div className="h-full flex flex-col p-8 bg-white overflow-y-auto w-full">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      </div>
    );
  }

  if (activeTicket) {
    return (
      <TicketDetail
        ticket={activeTicket}
        onBack={() => setActiveTicket(null)}
        isConnected={isConnected}
        onTicketUpdate={(updatedTicket) => {
          setActiveTicket(updatedTicket);
          setTickets(prev => prev.map(t => 
            t.code === updatedTicket.code ? updatedTicket : t
          ));
        }}
      />
    );
  }

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 bg-white overflow-y-auto w-full">
      <div className="mb-6 flex flex-col space-y-1 shrink-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Support</h1>
        <p className="text-slate-500">Get help and manage your support tickets</p>
        {isConnected && (
          <span className="inline-flex items-center text-xs text-emerald-600 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
            Live
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8 mb-8 shrink-0">
        <div className="flex-1 space-y-8">
          <FAQSection />
          <CreateTicketForm categories={categories} />
        </div>

        <div className="w-full lg:w-96 shrink-0 space-y-6">
          <DirectContactSection />
          <ResourcesSection />
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex text-xs space-x-2">
              <span className="text-slate-500 font-medium">Version:</span>
              <span className="font-bold text-slate-900">1.0.0</span>
            </div>
            <div className="flex text-xs space-x-2 mt-2">
              <span className="text-slate-500 font-medium">Last Updated:</span>
              <span className="font-bold text-slate-900">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col shrink-0">
        <h2 className="text-xl font-bold text-slate-900 mb-6">My Support Tickets</h2>
        <TicketStats tickets={tickets} />
        <TicketList
          tickets={tickets}
          statuses={statuses}
          onTicketClick={(ticket) => setActiveTicket(ticket)}
        />
      </div>
    </div>
  );
}