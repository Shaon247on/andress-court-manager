'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Users, Trash2, CalendarIcon, Zap, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Booking } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type BookingType = 'regular' | 'lesson' | 'event';

interface CreateBookingSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourt: string;
  startTime: number;
  endTime: number;
  date: Date;
  onCreate: (booking: Partial<Booking>) => Promise<void>;
}

export function CreateBookingSheet({ isOpen, onClose, selectedCourt, startTime, endTime, date, onCreate }: CreateBookingSheetProps) {
  const [bookingType, setBookingType] = useState<keyof typeof bookingTypeConfig>('regular');
  const [repeatType, setRepeatType] = useState<string>('none');
  const [ownerName, setOwnerName] = useState('');
  const [paymentType, setPaymentType] = useState('Single');
  const [pricePerPerson, setPricePerPerson] = useState('10.84');
  const [courtType, setCourtType] = useState('5v5');

  const [teamAPlayers, setTeamAPlayers] = useState(Array.from({ length: 3 }).map((_, i) => ({ id: Date.now() + i })));
  const [teamBPlayers, setTeamBPlayers] = useState(Array.from({ length: 4 }).map((_, i) => ({ id: Date.now() + i + 100 })));

  const handleCourtTypeChange = (val: string) => {
    setCourtType(val);
    const num = parseInt(val, 10) || 5;
    // Owner takes 1 slot, so additional players = num - 2 (per team minus owner)
    const extra = Math.max(0, num - 2);
    setTeamAPlayers(Array.from({ length: extra }).map((_, i) => ({ id: Date.now() + i })));
    setTeamBPlayers(Array.from({ length: num - 1 }).map((_, i) => ({ id: Date.now() + i + 100 })));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTeamAPlayer = () => {
    if (teamAPlayers.length < 10) {
      setTeamAPlayers([...teamAPlayers, { id: Date.now() }]);
    }
  };

  const addTeamBPlayer = () => {
    if (teamBPlayers.length < 11) {
      setTeamBPlayers([...teamBPlayers, { id: Date.now() }]);
    }
  };

  const removeTeamAPlayer = (id: number) => {
    setTeamAPlayers(teamAPlayers.filter(p => p.id !== id));
  };

  const removeTeamBPlayer = (id: number) => {
    setTeamBPlayers(teamBPlayers.filter(p => p.id !== id));
  };

  const formatSlotTime = (num: number) => {
    const hours = Math.floor(num);
    const mins = Math.floor((num % 1) * 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const handleCreate = async () => {
    if (!ownerName.trim()) return;
    setIsSubmitting(true);
    await onCreate({
      courtId: selectedCourt,
      title: bookingType === 'event' ? 'Event' : bookingType === 'lesson' ? 'Lesson' : ownerName,
      subtitle: `${formatSlotTime(startTime)} - ${formatSlotTime(endTime)}`,
      type: bookingType as any,
      startTime,
      endTime,
      date: format(date, 'yyyy-MM-dd')
    });
    setIsSubmitting(false);
    onClose();
  };

  const bookingTypeConfig = {
    regular: { label: 'Regular', color: 'bg-blue-primary', textColor: 'text-blue-100', icon: CalendarIcon },
    lesson:  { label: 'Lesson',  color: 'bg-primary', textColor: 'text-green-50', icon: Zap },
    event:   { label: 'Event',   color: 'bg-amber-500', textColor: 'text-amber-100', icon: Flag },
  };
  const activeConfig = bookingTypeConfig[bookingType] || bookingTypeConfig.regular;

  const handleBookingSubmit = () => {
    // Booking submission logic
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex px-6 border-b border-slate-200 bg-white items-center justify-between">
        <div className="flex gap-1 py-2">
          {(['regular', 'lesson', 'event'] as BookingType[]).map((type) => (
            <button
              key={type}
              onClick={() => setBookingType(type)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-colors",
                bookingType === type
                  ? type === 'event' ? 'bg-amber-100 text-amber-700 border border-amber-300'
                    : type === 'lesson' ? 'bg-green-light text-primary border border-primary'
                    : 'bg-blue-light text-blue-primary border border-blue-primary'
                  : 'text-slate-500 hover:bg-slate-100'
              )}
            >
              {type === 'event' ? '🏆 ' : type === 'lesson' ? '⚡ ' : '📅 '}{type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center text-base font-bold text-slate-800 py-2 px-3 bg-slate-100 rounded-md my-2 border border-slate-200 shadow-sm">
          <CalendarIcon className="w-4 h-4 mr-2 text-blue-primary" />
          {format(date, 'dd MMM yyyy')}
        </div>
      </div>

      <div className="p-6 space-y-6 flex-1 overflow-y-auto pb-32">
        <div className={cn("rounded-xl p-5 text-white shadow-md relative overflow-hidden", activeConfig.color)}>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className={cn("text-sm font-medium mb-1", activeConfig.textColor)}>{activeConfig.label} Slot</p>
              <p className="text-3xl font-black tracking-tight">{formatSlotTime(startTime)} - {formatSlotTime(endTime)}</p>
            </div>
            <div className="text-right">
              <p className={cn("text-sm font-medium mb-1", activeConfig.textColor)}>Court</p>
              <p className="text-xl font-bold">{selectedCourt.replace('-', ' ')}</p>
            </div>
          </div>
          <activeConfig.icon className="w-32 h-32 absolute -right-6 -bottom-6 text-white opacity-10 pointer-events-none" />
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-4">
          <h3 className="font-bold text-base">Booking Details</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs font-medium text-slate-600 block mb-1">Court Type</label>
              <select
                className="w-full flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-primary"
                value={courtType}
                onChange={(e) => handleCourtTypeChange(e.target.value)}
              >
                <option value="2v2">2v2</option>
                <option value="5v5">5v5</option>
                <option value="7v7">7v7</option>
                <option value="8v8">8v8</option>
                <option value="10v10">10v10</option>
                <option value="11v11">11v11</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-slate-600 block mb-1">Payment type</label>
              <select
                className="w-full flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-primary"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
              >
                <option>Single</option>
                <option>Split</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-slate-600 block mb-1">Price per person</label>
              <Input
                value={pricePerPerson}
                onChange={(e) => setPricePerPerson(e.target.value)}
                type="number" step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-base flex items-center">
            <Users className="w-5 h-5 mr-2" /> Participants
          </h3>

          {/* Team A */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
              <h4 className="text-sm font-bold text-slate-700">Team A</h4>
              <span className="text-xs text-slate-400 font-medium">{1 + teamAPlayers.length} / players</span>
            </div>

            <div className="p-4 space-y-3">
              {/* Fixed Owner Row — always first */}
              <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base leading-none">👑</span>
                  <span className="text-xs font-black text-blue-700 uppercase tracking-wider">Game Owner</span>
                  <span className="text-red-500 text-xs font-bold">*Required</span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-black">#1</span>
                  </div>
                  <Input
                    placeholder="Owner name (required)"
                    className="flex-1 border-blue-200 font-semibold focus:ring-blue-400 bg-white"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                  />
                  <Input value={pricePerPerson} className="w-20 text-center bg-white" readOnly />
                  <span className="text-slate-500">€</span>
                  <Button variant="blue" className="px-3 text-xs h-10 shrink-0">Paid</Button>
                </div>
              </div>

              {/* Column headers for additional players */}
              {teamAPlayers.length > 0 && (
                <div className="flex justify-between text-xs text-slate-400 px-1 pt-1">
                  <span>Player (optional)</span>
                  <div className="flex space-x-2 mr-1">
                    <span className="text-blue-primary">Price</span>
                    <span>Payment</span>
                  </div>
                </div>
              )}

              {/* Additional Team A players */}
              <div className="space-y-2">
                {teamAPlayers.map((player, idx) => (
                  <div key={player.id} className="flex gap-2 items-center">
                    <button
                      type="button"
                      onClick={() => removeTeamAPlayer(player.id)}
                      className="text-slate-300 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <span className="text-slate-500 text-[10px] font-bold">#{idx + 2}</span>
                    </div>
                    <Input placeholder="Enter a name" className="flex-1" icon={<Search className="w-4 h-4" />} />
                    <Input value={pricePerPerson} className="w-20 text-center" readOnly />
                    <span className="text-slate-500">€</span>
                    <Button variant="blue" className="px-3 text-xs h-10 shrink-0">Paid</Button>
                  </div>
                ))}
              </div>

              {teamAPlayers.length < 10 && (
                <button type="button" onClick={addTeamAPlayer} className="text-sm text-blue-primary hover:underline font-medium">+ Add Player</button>
              )}
            </div>
          </div>

          {/* Team B */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
              <h4 className="text-sm font-bold text-slate-700">Team B</h4>
              <span className="text-xs text-slate-400 font-medium">{teamBPlayers.length} / players</span>
            </div>

            <div className="p-4 space-y-3">
              {teamBPlayers.length > 0 && (
                <div className="flex justify-between text-xs text-slate-400 px-1">
                  <span>Player (optional)</span>
                  <div className="flex space-x-2 mr-1">
                    <span className="text-blue-primary">Price</span>
                    <span>Payment</span>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                {teamBPlayers.map((player, idx) => (
                  <div key={player.id} className="flex gap-2 items-center">
                    <button
                      type="button"
                      onClick={() => removeTeamBPlayer(player.id)}
                      className="text-slate-300 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <span className="text-slate-500 text-[10px] font-bold">#{idx + 1}</span>
                    </div>
                    <Input placeholder="Enter a name" className="flex-1" icon={<Search className="w-4 h-4" />} />
                    <Input value={pricePerPerson} className="w-20 text-center" readOnly />
                    <span className="text-slate-500">€</span>
                    <Button variant="blue" className="px-3 text-xs h-10 shrink-0">Paid</Button>
                  </div>
                ))}
              </div>
              {teamBPlayers.length < 11 && (
                <button type="button" onClick={addTeamBPlayer} className="text-sm text-blue-primary hover:underline font-medium">+ Add Player</button>
              )}
            </div>
          </div>

        </div>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Repeat</label>
            <Select value={repeatType}  onValueChange={setRepeatType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select repetition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-white">
        {!ownerName.trim() && (
          <p className="text-xs text-red-500 font-medium text-center mb-2">⚠ Owner name is required to create a booking</p>
        )}
        <Button variant="blue" className="w-full h-12" onClick={handleCreate} disabled={isSubmitting || !ownerName.trim()}>
          {isSubmitting ? 'Creating...' : 'Create Booking'}
        </Button>
      </div>
    </div>
  );
}
