// app/dashboard/support/components/TicketDetail.tsx

"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Paperclip, Send, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTicketThreadAction, replyToTicketAction } from '@/actions/manager-support.action';
import { useSupportSocket } from '@/hooks/useSupportSocket';
import type { SupportTicket, SupportThreadItem } from '@/types/ManagerSupport.type';
import { toast } from 'sonner';

interface TicketDetailProps {
  ticket: SupportTicket;
  onBack: () => void;
  isConnected: boolean;
  onTicketUpdate: (ticket: SupportTicket) => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    open: { label: 'Open', className: 'bg-red-100 text-red-700' },
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

export default function TicketDetail({
  ticket,
  onBack,
  isConnected,
  onTicketUpdate,
}: TicketDetailProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [thread, setThread] = useState<SupportThreadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<SupportTicket>(ticket);
  const [isLocked, setIsLocked] = useState(ticket.locked || ticket.status === 'resolved');

  // Use a set to track message IDs we've already seen
  const messageIdSet = useRef<Set<string>>(new Set());

  // Deduplicate messages - keep only unique ids
  const deduplicateMessages = useCallback((messages: SupportThreadItem[]): SupportThreadItem[] => {
    const seen = new Set<string>();
    return messages.filter(msg => {
      // If we've already seen this id, skip it
      if (seen.has(msg.id)) {
        return false;
      }
      seen.add(msg.id);
      return true;
    });
  }, []);

  // Update thread with deduplication
  const updateThreadWithDedup = useCallback((newMessages: SupportThreadItem[]) => {
    setThread(prev => {
      // Combine previous and new messages
      const combined = [...prev, ...newMessages];
      // Deduplicate
      const unique = deduplicateMessages(combined);
      // Sort by created_at (oldest first)
      return unique.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    });
  }, [deduplicateMessages]);

  // Socket for real-time updates
  useSupportSocket({
    ticketCode: ticket.code,
    onReply: (data) => {
      if (data.ticket_code === ticket.code) {
        // Check if we already have this message
        const existingIds = new Set(thread.map(t => t.id));
        if (!existingIds.has(data.reply.id)) {
          // Only add if we don't already have it
          updateThreadWithDedup([data.reply]);
          setCurrentTicket(prev => ({ ...prev, status: data.status as any }));
          onTicketUpdate({ ...currentTicket, status: data.status as any });
          scrollToBottom();
        } else {
          console.log('Duplicate reply skipped:', data.reply.id);
        }
      }
    },
    onStatus: (data) => {
      if (data.code === ticket.code) {
        setIsLocked(data.locked);
        setCurrentTicket(prev => ({ ...prev, status: data.status as any, locked: data.locked }));
        onTicketUpdate({ ...currentTicket, status: data.status as any, locked: data.locked });
        if (data.locked) {
          toast.info('This ticket has been resolved and is now locked.');
        }
      }
    },
  });

  const loadThread = async () => {
    setLoading(true);
    const res = await getTicketThreadAction(ticket.code);
    if (res.success) {
      // Deduplicate the loaded thread
      const uniqueThread = deduplicateMessages(res.data.thread);
      setThread(uniqueThread);
      setCurrentTicket(res.data.ticket);
      setIsLocked(res.data.ticket.locked || res.data.ticket.status === 'resolved');
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadThread();
  }, [ticket.code]);

  useEffect(() => {
    if (thread.length > 0) {
      scrollToBottom();
    }
  }, [thread]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (isLocked) {
      toast.error('This ticket is resolved and cannot be replied to');
      return;
    }

    setSending(true);
    const res = await replyToTicketAction(ticket.code, { message: replyMessage });
    if (res.success) {
      // Deduplicate the updated thread
      const uniqueThread = deduplicateMessages(res.data.thread);
      setThread(uniqueThread);
      setCurrentTicket(res.data.ticket);
      setIsLocked(res.data.ticket.locked || res.data.ticket.status === 'resolved');
      setReplyMessage('');
      onTicketUpdate(res.data.ticket);
      toast.success('Reply sent');
      scrollToBottom();
    } else {
      toast.error(res.message);
      if (res.message.includes('resolved')) {
        setIsLocked(true);
      }
    }
    setSending(false);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <p className="mt-4 text-slate-500">Loading conversation...</p>
      </div>
    );
  }

  const openingMessage = thread.find(msg => msg.is_opening);
  const otherMessages = thread.filter(msg => !msg.is_opening);

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center mb-4 shrink-0">
        <button
          onClick={onBack}
          className="p-2 border border-slate-200 bg-white mr-4 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">{ticket.subject}</h1>
          <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
            <span>Ticket {ticket.code}</span>
            <span>•</span>
            <StatusBadge status={currentTicket.status} />
            {isConnected && (
              <span className="inline-flex items-center text-xs text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                Live
              </span>
            )}
            {isLocked && (
              <span className="inline-flex items-center text-xs text-red-500">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
                Locked
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Initial Request Block */}
      {openingMessage && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 mb-4 shrink-0">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold mr-3 text-sm">
                {getInitials(openingMessage.sender.name)}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">{openingMessage.sender.name}</div>
                <div className="text-slate-500 text-xs capitalize">{openingMessage.sender.role.replace('_', ' ')}</div>
              </div>
            </div>
            <div className="text-slate-400 text-xs font-medium">
              {formatDate(openingMessage.created_at)}
            </div>
          </div>
          <h3 className="font-bold text-slate-900 mb-2">{ticket.subject}</h3>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
            {openingMessage.message}
          </p>
        </div>
      )}

      {/* Conversation Thread - Scrollable */}
      <div 
        ref={chatContainerRef} 
        className="flex-1 overflow-y-auto mb-4 min-h-0 pr-2"
      >
        {otherMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="font-medium">No replies yet</p>
              <p className="text-sm">Support will respond shortly</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {otherMessages.map((msg) => {
              const isStaff = msg.sender.is_staff;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isStaff ? 'items-start' : 'items-end'}`}
                >
                  <div className={`flex items-center gap-2 mb-1 ${isStaff ? '' : 'flex-row-reverse'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs ${isStaff ? 'bg-emerald-500' : 'bg-slate-400'}`}>
                      {getInitials(msg.sender.name)}
                    </div>
                    <span className="font-semibold text-slate-900 text-sm">
                      {msg.sender.name}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {formatDate(msg.created_at)}
                    </span>
                  </div>
                  <div className={`max-w-[85%] ${isStaff ? 'ml-9' : 'mr-9'}`}>
                    <div className={`rounded-2xl p-3 sm:p-4 text-sm leading-relaxed whitespace-pre-wrap ${
                      isStaff
                        ? 'bg-slate-50 border border-slate-100 rounded-tl-sm'
                        : 'bg-emerald-50 border border-emerald-100 rounded-tr-sm'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reply Box - Fixed at bottom */}
      <div className="shrink-0 border-t border-slate-200 pt-4">
        {isLocked ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center text-slate-500">
            <p className="font-medium">This ticket is resolved and locked</p>
            <p className="text-sm">No further replies can be added.</p>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400 transition-all">
            <textarea
              placeholder="Type your reply..."
              className="w-full h-24 p-4 resize-none bg-white focus:outline-none text-sm"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleReply();
                }
              }}
              disabled={sending}
            />
            <div className="flex justify-between items-center p-3 bg-white border-t border-slate-100 flex-wrap gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <Button
                variant="primary"
                className="h-10 px-6 rounded-lg font-semibold text-sm shadow-sm hover:shadow"
                onClick={handleReply}
                disabled={sending || !replyMessage.trim()}
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2 -ml-1" />
                )}
                Send Reply
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}