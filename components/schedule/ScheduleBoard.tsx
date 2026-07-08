'use client';

import React, { useState, useRef, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet } from '@/components/ui/sheet';
import { CreateBookingSheet } from './CreateBookingSheet';
import { fetchSchedule, createBooking, cancelBooking, updateBooking, Booking } from '@/lib/api';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const COURTS = [
  { id: 'Court 1', name: 'Court 1' },
  { id: 'Court 2', name: 'Court 2' },
  { id: 'Court 3', name: 'Court 3' },
  { id: 'Court 4', name: 'Court 4' },
];

const START_HOUR = 6;
const END_HOUR = 15;
const ROW_HEIGHT = 80;

export function ScheduleBoard() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date('2026-04-03'));
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragCourt, setDragCourt] = useState<string | null>(null);
  const [dragStartSlot, setDragStartSlot] = useState<number>(0);
  const [dragCurrentSlot, setDragCurrentSlot] = useState<number>(0);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{courtId: string, start: number, end: number} | null>(null);

  const [popoverBookingId, setPopoverBookingId] = useState<string | null>(null);

  const loadSchedule = async (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const data = await fetchSchedule(formattedDate);
    setBookings(data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSchedule(currentDate);
  }, [currentDate]);


  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  const handlePointerDown = (e: React.PointerEvent, courtId: string) => {
    if (e.button !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    let slot = START_HOUR + (y / ROW_HEIGHT);
    slot = Math.floor(slot * 2) / 2;
    setIsDragging(true);
    setDragCourt(courtId);
    setDragStartSlot(slot);
    setDragCurrentSlot(slot + 0.5);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent, courtId: string) => {
    if (!isDragging || dragCourt !== courtId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    let slot = START_HOUR + (y / ROW_HEIGHT);
    slot = Math.floor(slot * 2) / 2;
    if (slot > dragStartSlot) {
      setDragCurrentSlot(slot + 0.5);
    } else {
      setDragCurrentSlot(slot);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    const start = Math.min(dragStartSlot, dragCurrentSlot);
    let end = Math.max(dragStartSlot, dragCurrentSlot);
    if (start === end) end = start + 0.5;
    setSelectedSlot({ courtId: dragCourt!, start, end });
    setSheetOpen(true);
    setDragCourt(null);
  };

  const handleCreateBooking = async (data: Partial<Booking>) => {
    await createBooking(data);
    loadSchedule(currentDate);
  };

  const handleDragStart = (e: React.DragEvent, booking: Booking) => {
    e.stopPropagation();
    e.dataTransfer.setData('bookingId', booking.id);
    e.dataTransfer.setData('duration', (booking.endTime - booking.startTime).toString());
    e.dataTransfer.setData('type', booking.type);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, courtId: string) => {
    e.preventDefault();
    const bookingId = e.dataTransfer.getData('bookingId');
    const durationStr = e.dataTransfer.getData('duration');
    const type = e.dataTransfer.getData('type');
    
    if (!bookingId || !durationStr) return;
    const duration = parseFloat(durationStr);

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    let slot = START_HOUR + (y / ROW_HEIGHT);
    slot = Math.floor(slot * 2) / 2;

    let newStartTime = slot;
    let newEndTime = newStartTime + duration;
    if (newEndTime > END_HOUR) {
      newEndTime = END_HOUR;
      newStartTime = newEndTime - duration;
    }

    const formattedCourtId = courtId.toLowerCase().replace(' ', '-');
    const isLesson = type === 'lesson';
    const subtitle = `${formatSlotTime(newStartTime)} - ${formatSlotTime(newEndTime)}${isLesson ? '\nLesson' : ''}`;

    await updateBooking(bookingId, {
      courtId: formattedCourtId,
      startTime: newStartTime,
      endTime: newEndTime,
      subtitle
    });
    
    loadSchedule(currentDate);
  };

  const executeCancelBooking = async () => {
    if (bookingToCancel) {
      await cancelBooking(bookingToCancel);
      setPopoverBookingId(null);
      setIsCancelModalOpen(false);
      setBookingToCancel(null);
      loadSchedule(currentDate);
    }
  };

  const requestCancel = (id: string) => {
    setBookingToCancel(id);
    setIsCancelModalOpen(true);
    setPopoverBookingId(null);
  };

  const formatTimeLabel = (h: number) => {
    return `${h.toString().padStart(2, '0')}:00`;
  };


  return (
    <div className="flex flex-col h-full">
      {/* Schedule Controls */}
      <div className="p-4 flex items-center justify-between border-b border-slate-200 shrink-0">
        <div className="flex items-center space-x-4 w-1/2">
           <div className="flex-1">
             <Input icon={<CalendarIcon className="w-4 h-4" />} placeholder="Search by time or name..." />
           </div>
           <div className="w-40">
             <Input 
               type="date" 
               value={format(currentDate, 'yyyy-MM-dd')} 
               onChange={(e) => {
                 if (e.target.value) {
                   const [year, month, day] = e.target.value.split('-').map(Number);
                   setCurrentDate(new Date(year, month - 1, day));
                 }
               }} 
             />
           </div>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => setCurrentDate(subDays(currentDate, 1))} className="p-2 hover:bg-slate-100 rounded-md">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="font-bold text-slate-800 w-48 text-center shrink-0">
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </div>
          <Button variant="primary" size="sm" onClick={() => setCurrentDate(new Date())}>Today</Button>
          <button onClick={() => setCurrentDate(addDays(currentDate, 1))} className="p-2 hover:bg-slate-100 rounded-md">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-2 flex items-center space-x-6 text-sm border-b border-slate-200 shrink-0 text-slate-600 font-medium">
         <div className="flex items-center space-x-2">
           <div className="w-4 h-4 rounded bg-blue-light border border-blue-200"></div>
           <span>Regular</span>
         </div>
         <div className="flex items-center space-x-2">
           <div className="w-4 h-4 rounded bg-green-light border border-green-border"></div>
           <span>Lesson</span>
         </div>
         <div className="flex items-center space-x-2">
           <div className="w-4 h-4 rounded bg-amber-100 border border-amber-300"></div>
           <span>Event</span>
         </div>
      </div>

      {/* Grid Canvas */}
      <div className="flex-1 overflow-auto flex relative bg-slate-50">
        {/* Time Axis */}
        <div className="w-20 shrink-0 border-r border-slate-200 bg-white z-10 sticky left-0 text-sm font-medium text-slate-500 select-none">
          <div className="h-12 border-b border-slate-200 flex items-center px-4 font-bold text-slate-800">Time</div>
          {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => (
            <div key={i} className="px-4 flex items-start pt-2 border-b border-slate-100" style={{ height: `${ROW_HEIGHT}px` }}>
              {formatTimeLabel(START_HOUR + i)}
            </div>
          ))}
        </div>

        {/* Court Columns */}
        <div className="flex-1 flex min-w-[800px] select-none">
          {COURTS.map((court, index) => (
            <div key={court.id} className={cn("flex flex-col flex-1 border-r border-slate-200", index === COURTS.length-1 ? 'border-r-0' : '')}>
              <div className="h-12 border-b border-slate-200 flex items-center px-4 bg-white sticky top-0 z-10 font-bold text-slate-800 shrink-0 relative">
                {court.name}
              </div>
              <div 
                className="flex-1 relative calendar-grid bg-white cursor-pointer"
                onPointerDown={(e) => handlePointerDown(e, court.id)}
                onPointerMove={(e) => handlePointerMove(e, court.id)}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, court.id)}
                style={{ height: `${(END_HOUR - START_HOUR) * ROW_HEIGHT}px` }}
              >
                {/* Click & Drag hint — shown at the top of the column */}
                <div className="absolute top-2 left-0 right-0 flex items-center justify-center z-0 pointer-events-none">
                  <div className="flex items-center gap-1.5 text-slate-400 opacity-40">
                    <MousePointerClick className="w-4 h-4" />
                    <span className="text-xs font-medium">Click & Drag</span>
                  </div>
                </div>

                {/* Render Bookings for this court */}
                {bookings.filter(b => b.courtId.toLowerCase() === court.id.toLowerCase().replace(' ', '-')).map(booking => {
                  const top = (booking.startTime - START_HOUR) * ROW_HEIGHT;
                  const height = (booking.endTime - booking.startTime) * ROW_HEIGHT;
                  const isLesson = booking.type === 'lesson';
                  const isPopoverOpen = popoverBookingId === booking.id;

                  return (
                    <div 
                      key={booking.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, booking)}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setSelectedSlot({ courtId: booking.courtId, start: booking.startTime, end: booking.endTime });
                        setSheetOpen(true);
                      }}
                      className={cn(
                        "absolute left-1 right-1 rounded-md border p-2 cursor-grab active:cursor-grabbing transition-all overflow-hidden z-20 shadow-sm hover:shadow-md",
                        isLesson
                          ? "bg-green-light border-green-border text-green-dark"
                          : booking.type === 'event'
                          ? "bg-amber-100 border-amber-300 text-amber-900"
                          : "bg-blue-light border-blue-200 text-slate-800"
                      )}
                      style={{ top: `${top}px`, height: `${height}px` }}
                    >
                      <div className="font-semibold text-sm leading-tight">{booking.title}</div>
                      <div className="text-xs mt-1 whitespace-pre-wrap leading-tight opacity-80">{booking.subtitle}</div>
                    </div>
                  );
                })}

                {/* Drag Visual Indicator */}
                {isDragging && dragCourt === court.id && (
                  <div 
                    className="absolute left-1 right-1 bg-blue-primary/20 border-2 border-blue-primary rounded-md pointer-events-none z-30"
                    style={{
                      top: `${((Math.min(dragStartSlot, dragCurrentSlot)) - START_HOUR) * ROW_HEIGHT}px`,
                      height: `${Math.max(0.5, Math.abs(dragCurrentSlot - dragStartSlot)) * ROW_HEIGHT}px`
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Sheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} title="Create regular booking">
        {selectedSlot && (
          <CreateBookingSheet
            isOpen={sheetOpen}
            onClose={() => setSheetOpen(false)}
            selectedCourt={selectedSlot.courtId}
            startTime={selectedSlot.start}
            endTime={selectedSlot.end}
            date={currentDate}
            onCreate={handleCreateBooking}
          />
        )}
      </Sheet>

      {/* Cancel Booking Modal */}
      <AnimatePresence>
        {isCancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsCancelModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg p-6 shadow-xl w-full max-w-sm relative z-10"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-slate-900">Cancel Booking</h3>
                <button onClick={() => setIsCancelModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <p className="text-slate-600 mb-6">
                Are you sure you want to cancel this booking?<br/>This action cannot be undone.
              </p>
              <div className="flex space-x-3 justify-end items-center">
                <Button variant="secondary" onClick={() => setIsCancelModalOpen(false)}>
                  Keep Booking
                </Button>
                <Button variant="danger" onClick={executeCancelBooking}>
                  Cancel Booking
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Utility formatting
function formatSlotTime(num: number) {
  const hours = Math.floor(num);
  const mins = Math.floor((num % 1) * 60);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}
