'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronDown, User, Calendar as CalendarIcon, MapPin, Trophy, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tournament } from './page';

type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalWrapper = ({ isOpen, onClose, title, children, maxWidth = "max-w-[480px]" }: { 
  isOpen: boolean, 
  onClose: () => void, 
  title: React.ReactNode, 
  children: React.ReactNode,
  maxWidth?: string 
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60" onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className={cn("bg-white rounded-xl shadow-2xl w-full relative z-10 flex flex-col max-h-[90vh]", maxWidth)}
      >
        <div className="p-5 border-b border-slate-100 flex justify-between items-start shrink-0">
           <div>{title}</div>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-50 transition-colors">
              <X className="w-5 h-5" />
           </button>
        </div>
        <div className="p-6 overflow-y-auto w-full">
           {children}
        </div>
      </motion.div>
    </div>
  );
};


export function CreateTournamentModal({ isOpen, onClose }: BaseModalProps) {
  const [teamType, setTeamType] = useState('2v2');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const teamTypes = ['2v2', '3v3', '4v4', '5v5', '6v6', '7v7'];

  return (
    <AnimatePresence>
      <ModalWrapper isOpen={isOpen} onClose={onClose} title={<h2 className="text-lg font-bold text-slate-900">Create Tournament</h2>}>
         <div className="space-y-5">
           <div>
             <label className="block text-xs font-semibold text-slate-700 mb-1.5">Title *</label>
             <Input className="h-10" />
           </div>
           <div>
             <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description *</label>
             <textarea className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none" />
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
                <Input defaultValue="Open" className="h-10" />
              </div>
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Team Type *</label>
                <div 
                  className="flex items-center justify-between h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm cursor-pointer hover:border-slate-300 transition-colors"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>{teamType}</span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </div>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-20 overflow-hidden py-1">
                     {teamTypes.map(opt => (
                        <div 
                          key={opt}
                          className="px-4 py-2 text-sm cursor-pointer hover:bg-slate-50 flex justify-between items-center font-medium border-b border-slate-50 last:border-0"
                          onClick={() => { setTeamType(opt); setIsDropdownOpen(false); }}
                        >
                          {opt} <ChevronDown className="-rotate-90 w-4 h-4 text-slate-400 opacity-50" />
                        </div>
                     ))}
                  </div>
                )}
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Start Date *</label>
                <Input placeholder="mm/dd/yyyy" className="h-10" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">End Date</label>
                <Input placeholder="mm/dd/yyyy" className="h-10" />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Start Time</label>
                <Input defaultValue="09:30 AM" className="h-10" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">End Time</label>
                <Input defaultValue="09:30 PM" className="h-10" />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Number of Teams *</label>
                <Input defaultValue="16" type="number" className="h-10" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Capacity *</label>
                <Input defaultValue="16" type="number" className="h-10" />
              </div>
           </div>

           <div>
             <label className="block text-xs font-semibold text-slate-700 mb-1.5">Rewards</label>
             <Input placeholder="e.g. 1st: $500, 2nd: $300, 3rd: $150" className="h-10" />
           </div>
         </div>

         <div className="mt-8 flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose} className="px-6 rounded-md font-semibold">Cancel</Button>
            <Button variant="primary" onClick={onClose} className="px-6 rounded-md font-semibold text-sm">Create Tournament</Button>
         </div>
      </ModalWrapper>
    </AnimatePresence>
  );
}


export function EditTournamentModal({ isOpen, onClose, tournament }: BaseModalProps & { tournament: Tournament }) {
  const [teamType, setTeamType] = useState(tournament.teamType);

  return (
    <AnimatePresence>
      <ModalWrapper isOpen={isOpen} onClose={onClose} title={<h2 className="text-lg font-bold text-slate-900">Edit Tournament</h2>}>
         <div className="space-y-5">
           <div>
             <label className="block text-xs font-semibold text-slate-700 mb-1.5">Title *</label>
             <Input defaultValue={tournament.title} className="h-10" />
           </div>
           <div>
             <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description *</label>
             <textarea defaultValue={tournament.description} className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none" />
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
                <Input defaultValue={tournament.category} className="h-10" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Team Type *</label>
                <div className="flex items-center justify-between h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm cursor-pointer">
                  <span>{teamType}</span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </div>
              </div>
           </div>

           <div>
             <label className="block text-xs font-semibold text-slate-700 mb-1.5">Capacity *</label>
             <Input defaultValue={tournament.capacity} type="number" className="h-10" />
             <p className="text-[10px] text-slate-500 mt-1">Cannot be less than registered teams ({tournament.registeredTeams})</p>
           </div>

           <div>
             <label className="block text-xs font-semibold text-slate-700 mb-1.5">Rewards</label>
             <Input defaultValue={tournament.rewards.join(', ')} className="h-10" />
           </div>
         </div>

         <div className="mt-8 flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose} className="px-6 rounded-md font-semibold">Cancel</Button>
            <Button variant="primary" onClick={onClose} className="px-6 rounded-md font-semibold text-sm">Save Changes</Button>
         </div>
      </ModalWrapper>
    </AnimatePresence>
  );
}


export function ManageMatchesModal({ isOpen, onClose, tournament }: BaseModalProps & { tournament: Tournament }) {
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [activeScoreInputId, setActiveScoreInputId] = useState<string | null>('match2');

  const Title = (
    <div>
      <h2 className="text-lg font-bold text-slate-900">Manage Matches</h2>
      <p className="text-xs text-slate-500 font-medium tracking-wide mt-0.5">{tournament.title}</p>
    </div>
  );

  return (
    <AnimatePresence>
      <ModalWrapper isOpen={isOpen} onClose={onClose} title={Title} maxWidth="max-w-[700px]">
         <div className="space-y-6 pb-6 border-b border-slate-100">
            {!isAddingMode ? (
               <Button variant="primary" className="h-9 px-4 text-sm font-semibold rounded" onClick={() => setIsAddingMode(true)}>
                  <Plus className="w-4 h-4 mr-1.5" /> Add Match
               </Button>
            ) : (
               <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-5">
                  <h4 className="font-bold text-slate-900 mb-4 text-sm">Add New Match</h4>
                  <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Team 1 Name" className="h-10 bg-white" />
                        <Input placeholder="Team 2 Name" className="h-10 bg-white" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="11 / 15 / 2026" className="h-10 bg-white" />
                        <Input placeholder="10:00" className="h-10 bg-white" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Court X" className="h-10 bg-white" />
                     </div>
                     <div className="flex space-x-3 pt-2">
                        <Button variant="primary" className="h-9 px-4 text-sm font-semibold rounded" onClick={() => setIsAddingMode(false)}>Add Match</Button>
                        <Button variant="secondary" className="h-9 px-4 text-sm font-semibold rounded" onClick={() => setIsAddingMode(false)}>Cancel</Button>
                     </div>
                  </div>
               </div>
            )}

            <div className="space-y-3">
               {/* Match 1 */}
               <div className="border border-slate-200 rounded-lg p-5 bg-white">
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                       <span className="font-bold text-slate-900 text-sm">Team Alpha</span>
                       <span className="mx-3 text-[10px] font-bold text-slate-400">VS</span>
                       <span className="font-bold text-slate-900 text-sm">Team Beta</span>
                    </div>
                    <button className="text-red-500 font-medium text-xs border border-red-200 rounded px-2.5 py-1 hover:bg-red-50 transition-colors">
                      Delete
                    </button>
                 </div>
                 <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500 tracking-wide mb-5">
                    <span className="flex items-center"><CalendarIcon className="w-3.5 h-3.5 mr-1.5" /> Apr 15, 2026</span>
                    <span className="flex items-center"><Trophy className="w-3.5 h-3.5 mr-1.5" /> 09:00</span>
                    <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1.5" /> Court 1</span>
                 </div>
                 
                 {activeScoreInputId === 'match1' ? (
                   <div className="flex items-center space-x-3">
                     <Input className="w-20 text-center h-8 font-bold" defaultValue="0" />
                     <span className="text-slate-400 font-bold">-</span>
                     <Input className="w-20 text-center h-8 font-bold" defaultValue="0" />
                     <Button variant="primary" className="h-8 px-4 text-xs rounded">Save Score</Button>
                     <Button variant="secondary" className="h-8 px-4 text-xs rounded" onClick={() => setActiveScoreInputId(null)}>Cancel</Button>
                   </div>
                 ) : (
                   <div className="flex">
                     <Button variant="primary" className="h-8 px-4 text-xs rounded font-semibold bg-emerald-500 hover:bg-emerald-600" onClick={() => setActiveScoreInputId('match1')}>
                        Update Score
                     </Button>
                   </div>
                 )}
               </div>

               {/* Match 2 */}
               <div className="border border-slate-200 rounded-lg p-5 bg-white">
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                       <span className="font-bold text-slate-900 text-sm">Team Gamma</span>
                       <span className="mx-3 text-[10px] font-bold text-slate-400">VS</span>
                       <span className="font-bold text-slate-900 text-sm">Team Delta</span>
                    </div>
                    <button className="text-red-500 font-medium text-xs border border-red-200 rounded px-2.5 py-1 hover:bg-red-50 transition-colors">
                      Delete
                    </button>
                 </div>
                 <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500 tracking-wide mb-5">
                    <span className="flex items-center"><CalendarIcon className="w-3.5 h-3.5 mr-1.5" /> Apr 15, 2026</span>
                    <span className="flex items-center"><Trophy className="w-3.5 h-3.5 mr-1.5" /> 10:30</span>
                    <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1.5" /> Court 2</span>
                 </div>
                 
                 {activeScoreInputId === 'match2' ? (
                   <div className="flex items-center space-x-3">
                     <Input className="w-20 text-center h-8 font-bold" defaultValue="0" />
                     <span className="text-slate-400 font-bold">-</span>
                     <Input className="w-20 text-center h-8 font-bold" defaultValue="0" />
                     <Button variant="primary" className="h-8 px-4 text-xs rounded bg-emerald-500 hover:bg-emerald-600">Save Score</Button>
                     <Button variant="secondary" className="h-8 px-4 text-xs rounded" onClick={() => setActiveScoreInputId(null)}>Cancel</Button>
                   </div>
                 ) : (
                   <div className="flex">
                     <Button variant="primary" className="h-8 px-4 text-xs rounded font-semibold bg-emerald-500 hover:bg-emerald-600" onClick={() => setActiveScoreInputId('match2')}>
                        Update Score
                     </Button>
                   </div>
                 )}
               </div>
            </div>
         </div>

         <div className="mt-5 flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose} className="px-6 rounded font-semibold">Cancel</Button>
            <Button variant="primary" onClick={onClose} className="px-6 rounded font-semibold text-sm">Save Changes</Button>
         </div>
      </ModalWrapper>
    </AnimatePresence>
  );
}

export function RegisterTeamModal({ isOpen, onClose }: BaseModalProps) {
  const Title = (
    <div>
      <h2 className="text-lg font-bold text-slate-900">Register Team</h2>
      <p className="text-xs text-slate-500 font-medium tracking-wide mt-0.5">Spring Championship 2026</p>
    </div>
  );

  return (
    <AnimatePresence>
       <ModalWrapper isOpen={isOpen} onClose={onClose} title={Title} maxWidth="max-w-[420px]">
         <div className="space-y-5">
           <div>
             <label className="block text-xs font-semibold text-slate-700 mb-1.5">Team Name *</label>
             <Input placeholder="Enter team name" className="h-10" />
           </div>

           <div>
             <label className="block text-xs font-semibold text-slate-700 mb-2">Players (2 required) *</label>
             <div className="space-y-3">
                <Input placeholder="Player 1 Name" icon={<User className="w-4 h-4" />} className="h-10" />
                <Input placeholder="Player 2 Name" icon={<User className="w-4 h-4" />} className="h-10" />
             </div>
           </div>

           <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 space-y-1.5">
              <div className="flex text-xs"><span className="text-slate-500 w-24">Team Type:</span> <span className="font-bold text-primary">2v2</span></div>
              <div className="flex text-xs"><span className="text-slate-500 w-24">Spots Left:</span> <span className="font-bold text-primary">4</span></div>
           </div>
         </div>
         
         <div className="mt-8 flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose} className="px-6 rounded font-semibold">Cancel</Button>
            <Button variant="primary" onClick={onClose} className="px-6 rounded font-semibold text-sm">Register Team</Button>
         </div>
       </ModalWrapper>
    </AnimatePresence>
  );
}
