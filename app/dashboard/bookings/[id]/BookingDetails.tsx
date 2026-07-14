"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  CalendarDays, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  UserPlus,
  Users,
  DollarSign,
  Calendar,
  Clock as ClockIcon,
  Eye,
  EyeOff,
  Crown,
  Wallet,
  XCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BookingDetail, BookingPlayerSlot } from '@/types/Booking.type';
import { cn } from '@/lib/utils';

interface BookingDetailsProps {
  booking: BookingDetail;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-800 border-green-200' },
    completed: { label: 'Completed', className: 'bg-blue-100 text-blue-800 border-blue-200' },
    pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800 border-red-200' },
  };
  const { label, className } = statusMap[status] || statusMap.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      {label}
    </span>
  );
};

const PaymentStatusBadge = ({ isPaid }: { isPaid: boolean }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
      isPaid 
        ? 'bg-green-100 text-green-800 border-green-200' 
        : 'bg-red-100 text-red-800 border-red-200'
    }`}>
      {isPaid ? 'Paid' : 'Unpaid'}
    </span>
  );
};

const PaymentTypeBadge = ({ type }: { type: string }) => {
  const typeMap: Record<string, { label: string; className: string }> = {
    single: { label: 'Single', className: 'bg-slate-100 text-slate-700' },
    split: { label: 'Split', className: 'bg-emerald-100 text-emerald-700' },
    full: { label: 'Full', className: 'bg-blue-100 text-blue-700' },
  };
  const { label, className } = typeMap[type] || typeMap.single;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${className}`}>
      {label}
    </span>
  );
};

const PositionBadge = ({ position }: { position?: string }) => {
  if (!position) return null;
  const positionMap: Record<string, { label: string; color: string }> = {
    att: { label: 'ATT', color: 'bg-red-50 text-red-600 border-red-200' },
    mid: { label: 'MID', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    def: { label: 'DEF', color: 'bg-green-50 text-green-600 border-green-200' },
    gk: { label: 'GK', color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
  };
  const pos = positionMap[position.toLowerCase()] || { 
    label: position.toUpperCase(), 
    color: 'bg-gray-50 text-gray-600 border-gray-200' 
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${pos.color}`}>
      {pos.label}
    </span>
  );
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export default function BookingDetails({ booking }: BookingDetailsProps) {
  const renderPlayerSlot = (player: BookingPlayerSlot, teamName: string) => {
    if (player.open) {
      return (
        <div 
          key={`${teamName}-slot-${player.slot}`} 
          className="p-3 sm:p-4 bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-200 flex items-center gap-3 sm:gap-4 hover:border-slate-300 transition-colors"
        >
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="font-medium text-slate-400 text-sm">Slot {player.slot}</div>
            <div className="text-xs text-slate-400 font-medium">Open Slot</div>
          </div>
        </div>
      );
    }

    return (
      <div 
        key={`${teamName}-player-${player.slot}`} 
        className={cn(
          "p-3 sm:p-4 bg-white rounded-xl border shadow-sm flex items-center gap-3 sm:gap-4 hover:shadow-md transition-shadow",
          player.is_captain ? "border-amber-300 bg-amber-50/30" : "border-slate-200"
        )}
      >
        <div className={cn(
          "h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shrink-0 relative",
          player.is_captain ? "bg-amber-500" : "bg-indigo-500"
        )}>
          {player.name?.charAt(0) || 'P'}
          {player.is_captain && (
            <div className="absolute -top-1 -right-1">
              <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
            <span className="font-semibold text-slate-900 text-sm sm:text-base truncate">
              {player.name}
            </span>
            {player.is_captain && (
              <Badge variant="outline" className="text-[10px] bg-amber-100 text-amber-800 border-amber-200 px-1.5 py-0">
                Captain
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <PositionBadge position={player.position} />
            {player.ovr && player.ovr > 0 && (
              <span className="inline-flex items-center text-xs font-medium bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                ★ {player.ovr} OVR
              </span>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs sm:text-sm font-bold text-slate-900">
              ${parseFloat(player.amount || '0').toFixed(2)}
            </span>
            <PaymentStatusBadge isPaid={player.is_paid || false} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 bg-white overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/bookings"
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Booking #{booking.code}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {booking.court.name} • {booking.game_format}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={booking.status} />
          {booking.visibility === 'private' ? (
            <EyeOff className="w-4 h-4 text-slate-400" />
          ) : (
            <Eye className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {/* Booking Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 shrink-0">
        <Card className="border border-slate-200 shadow-none">
          <CardContent className="p-3 sm:p-4 flex items-center gap-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Date</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-900">{formatDate(booking.date)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 shadow-none">
          <CardContent className="p-3 sm:p-4 flex items-center gap-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
              <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Time</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-900">{booking.time}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 shadow-none">
          <CardContent className="p-3 sm:p-4 flex items-center gap-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Price</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-900">${parseFloat(booking.price).toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 shadow-none">
          <CardContent className="p-3 sm:p-4 flex items-center gap-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Format</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-900">{booking.game_format}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer & Payment Info */}
      <Card className="border border-slate-200 shadow-none mb-4 sm:mb-6 shrink-0">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Customer</p>
              <p className="text-xs sm:text-sm font-medium text-slate-900">{booking.customer.name}</p>
              <p className="text-xs text-slate-500">{booking.customer.email}</p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Payment Type</p>
              <PaymentTypeBadge type={booking.payment_type} />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Total Amount</p>
              <p className="text-xs sm:text-sm font-bold text-slate-900">${parseFloat(booking.total_amount).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Per Player</p>
              <p className="text-xs sm:text-sm font-bold text-slate-900">${parseFloat(booking.per_player).toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teams Lineup */}
      <div className="flex-1 min-h-0">
        <h3 className="text-sm font-semibold text-slate-900 mb-3 sm:mb-4 shrink-0">Teams Lineup</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Team A */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
                {booking.team_a.name}
              </h4>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{booking.team_a.filled}/{booking.team_a.capacity} filled</span>
              </div>
            </div>
            <div className="space-y-2">
              {booking.team_a.players.map((player) => 
                renderPlayerSlot(player, booking.team_a.name)
              )}
            </div>
          </div>

          {/* Team B */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                {booking.team_b.name}
              </h4>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{booking.team_b.filled}/{booking.team_b.capacity} filled</span>
              </div>
            </div>
            <div className="space-y-2">
              {booking.team_b.players.map((player) => 
                renderPlayerSlot(player, booking.team_b.name)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}