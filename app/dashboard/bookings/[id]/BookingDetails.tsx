// app/dashboard/bookings/[id]/BookingDetails.tsx

"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  XCircle,
  Euro
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BookingDetail, BookingParticipant } from '@/types/Booking.type';
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
  // ── Group participants by team ──
  const teamAPlayers = booking.participants.filter(p => p.team === 'a');
  const teamBPlayers = booking.participants.filter(p => p.team === 'b');

  // ── Get team names from the booking ──
  const teamAName = booking.team_a?.name || 'Team A';
  const teamBName = booking.team_b?.name || 'Team B';
  const teamACapacity = booking.team_a?.capacity || 0;
  const teamBCapacity = booking.team_b?.capacity || 0;
  const teamAFilled = booking.team_a?.filled || 0;
  const teamBFilled = booking.team_b?.filled || 0;

  const renderPlayerSlot = (participant: BookingParticipant, teamName: string) => {
    const customerId = participant.user_id || '';
    const isClickable = !!customerId;
    const hasPhoto = participant.photo_url && participant.photo_url !== '';
console.log("the  photo url:",teamAPlayers)
    const PlayerCard = () => (
      <div 
        className={cn(
          "p-3 sm:p-4 bg-white rounded-xl border shadow-sm flex items-center gap-3 sm:gap-4 transition-all",
          participant.is_game_owner ? "border-amber-300 bg-amber-50/30" : "border-slate-200",
          isClickable && "hover:shadow-md hover:bg-slate-50/50 cursor-pointer"
        )}
      >
        {/* Avatar with Photo */}
        <div className="relative shrink-0">
          {hasPhoto ? (
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden border-2 border-slate-200">
              <Image
                src={participant.photo_url!}
                alt={participant.player_name || 'Player'}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className={cn(
              "h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base",
              participant.is_game_owner ? "bg-amber-500" : "bg-indigo-500"
            )}>
              {participant.player_name?.charAt(0) || 'P'}
            </div>
          )}
          
          {/* Crown for game owner */}
          {participant.is_game_owner && (
            <div className="absolute -top-1 -right-1">
              <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
            <span className="font-semibold text-slate-900 text-sm sm:text-base truncate">
              {participant.player_name}
            </span>
            {participant.is_game_owner && (
              <Badge variant="outline" className="text-[10px] bg-amber-100 text-amber-800 border-amber-200 px-1.5 py-0">
                Captain
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <PositionBadge position={participant.position_role} />
            {participant.amount_to_pay && (
              <span className="inline-flex items-center text-xs font-medium text-slate-500">
                €{parseFloat(participant.amount_to_pay).toFixed(2)}
              </span>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs sm:text-sm font-bold text-slate-900">
              €{parseFloat(participant.amount_to_pay || '0').toFixed(2)}
            </span>
            <PaymentStatusBadge isPaid={participant.is_paid || false} />
          </div>
        </div>
      </div>
    );

    if (isClickable) {
      return (
        <Link
          key={participant.user_id}
          href={`/dashboard/customers/${customerId}`}
          className="block"
        >
          <PlayerCard />
        </Link>
      );
    }

    return <PlayerCard key={participant.id} />;
  };

  // ── Render open slots for a team ──
  const renderOpenSlots = (team: 'a' | 'b', filled: number, capacity: number) => {
    const openSlots = capacity - filled;
    
    return Array.from({ length: openSlots }, (_, index) => (
      <div 
        key={`open-slot-${team}-${index}`}
        className="p-3 sm:p-4 bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-200 flex items-center gap-3 sm:gap-4 hover:border-slate-300 transition-colors"
      >
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
          <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <div className="font-medium text-slate-400 text-sm">Slot {filled + index + 1}</div>
          <div className="text-xs text-slate-400 font-medium">Open Slot</div>
        </div>
      </div>
    ));
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
              {booking.court_name} • {booking.game_format}
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
              <Euro className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Price</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-900">€{parseFloat(booking.price).toFixed(2)}</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
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
              <p className="text-xs sm:text-sm font-bold text-slate-900">€{parseFloat(booking.total_amount).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Per Player</p>
              <p className="text-xs sm:text-sm font-bold text-slate-900">€{parseFloat(booking.per_player).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Booking Type</p>
              <p className="text-xs sm:text-sm font-bold text-slate-900 capitalize">{booking.booking_type}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teams Lineup - Using participants array */}
      <div className="flex-1 min-h-0">
        <h3 className="text-sm font-semibold text-slate-900 mb-3 sm:mb-4 shrink-0">Teams Lineup</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Team A */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
                {teamAName}
              </h4>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{teamAFilled}/{teamACapacity} filled</span>
              </div>
            </div>
            <div className="space-y-2">
              {teamAPlayers.map((participant) => renderPlayerSlot(participant, teamAName))}
              {renderOpenSlots('a', teamAFilled, teamACapacity)}
            </div>
          </div>

          {/* Team B */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                {teamBName}
              </h4>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{teamBFilled}/{teamBCapacity} filled</span>
              </div>
            </div>
            <div className="space-y-2">
              {teamBPlayers.map((participant) => renderPlayerSlot(participant, teamBName))}
              {renderOpenSlots('b', teamBFilled, teamBCapacity)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}