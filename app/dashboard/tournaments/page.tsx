'use client';

import React, { useState } from 'react';
import { Trophy, Search, Plus, Edit2, UserPlus, Trash2, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CreateTournamentModal, EditTournamentModal, ManageMatchesModal, RegisterTeamModal } from './TournamentModals';

export type Tournament = {
  id: string;
  title: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  capacity: number;
  registeredTeams: number;
  category: string;
  teamType: string;
  rewards: string[];
};

const mockTournament: Tournament = {
  id: 't-1',
  title: 'Spring Championship 2026',
  description: 'Annual spring badminton championship for all skill levels',
  dateStart: 'Apr 15',
  dateEnd: 'Apr 17, 2026',
  capacity: 16,
  registeredTeams: 12,
  category: 'Open',
  teamType: '2v2',
  rewards: ['1st: $500', '2nd: $300', '3rd: $150']
};

export default function TournamentsPage() {
  const [filterType, setFilterType] = useState<'All' | 'Open' | 'Full'>('All');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isManageMatchesModalOpen, setIsManageMatchesModalOpen] = useState(false);
  const [isRegisterTeamModalOpen, setIsRegisterTeamModalOpen] = useState(false);

  return (
    <div className="h-full flex flex-col p-8 bg-slate-50/50 overflow-y-auto w-full">
      <div className="mb-6 flex flex-col space-y-1 shrink-0">
        <h1 className="text-3xl font-bold text-slate-900">Tournaments</h1>
        <p className="text-slate-500">Create and manage tournaments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 shrink-0">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="text-sm font-medium text-slate-500 mb-2">Active Tournaments</div>
          <div className="text-3xl font-bold text-slate-900">1</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="text-sm font-medium text-slate-500 mb-2">Total Teams</div>
          <div className="text-3xl font-bold text-blue-600">12</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="text-sm font-medium text-slate-500 mb-2">Upcoming Matches</div>
          <div className="text-3xl font-bold text-primary">2</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0 shrink-0">
         <div className="flex space-x-4 items-center">
            <div className="w-80">
              <Input icon={<Search className="w-4 h-4"/>} placeholder="Search tournaments..." />
            </div>
            <div className="flex border border-slate-200 rounded-md overflow-hidden bg-white p-1">
               {['All', 'Open', 'Full'].map(type => (
                 <button 
                   key={type}
                   onClick={() => setFilterType(type as any)}
                   className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${filterType === type ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                 >
                   {type}
                 </button>
               ))}
            </div>
         </div>
         <Button variant="primary" className="h-10 px-4" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Create Tournament
         </Button>
      </div>

      {/* Tournament Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col mb-6">
         <div className="flex justify-between items-start mb-6">
            <div className="flex space-x-5">
               <div className="w-14 h-14 rounded-lg bg-yellow-100 flex items-center justify-center shrink-0 border border-yellow-200">
                  <Trophy className="w-7 h-7 text-yellow-600" />
               </div>
               <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center">
                    {mockTournament.title}
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">{mockTournament.description}</p>
                  
                  <div className="flex items-center space-x-4 mt-3 text-sm text-slate-600">
                     <span className="flex items-center"><CalendarIcon className="w-4 h-4 mr-1.5 text-slate-400" /> {mockTournament.dateStart} - {mockTournament.dateEnd}</span>
                     <span className="flex items-center"><UserPlus className="w-4 h-4 mr-1.5 text-slate-400" /> {mockTournament.teamType}</span>
                     <span className="flex items-center"><Trophy className="w-4 h-4 mr-1.5 text-slate-400" /> {mockTournament.category}</span>
                  </div>
               </div>
            </div>
            
            <div className="flex flex-col items-end space-y-3">
               <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                  {mockTournament.capacity - mockTournament.registeredTeams} slots left
               </span>
               <span className="text-sm font-medium text-slate-600">{mockTournament.registeredTeams} / {mockTournament.capacity} teams</span>
               <div className="flex space-x-3 pt-1">
                  <button onClick={() => setIsEditModalOpen(true)} className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => setIsRegisterTeamModalOpen(true)} className="p-1 text-primary hover:bg-green-50 rounded transition-colors"><UserPlus className="w-4 h-4" /></button>
                  <button className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
               </div>
            </div>
         </div>

         <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-4 mb-6">
            <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Rewards</h4>
            <p className="text-sm font-medium text-amber-900">{mockTournament.rewards.join(', ')}</p>
         </div>

         <div className="pt-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900">Matches (0 / 2)</h3>
              <button 
                onClick={() => setIsManageMatchesModalOpen(true)}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Manage Matches
              </button>
            </div>
            
            <div className="space-y-3">
               <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center">
                     <span className="font-bold text-slate-900">Team Alpha</span>
                     <span className="mx-3 text-xs font-medium text-slate-400">vs</span>
                     <span className="font-bold text-slate-900">Team Beta</span>
                  </div>
                  <div className="flex space-x-6 text-sm text-slate-500 font-medium tracking-wide">
                     <span>Apr 15</span>
                     <span>09:00</span>
                     <span className="text-slate-800 font-semibold">Court 1</span>
                  </div>
               </div>

               <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center">
                     <span className="font-bold text-slate-900">Team Gamma</span>
                     <span className="mx-3 text-xs font-medium text-slate-400">vs</span>
                     <span className="font-bold text-slate-900">Team Delta</span>
                  </div>
                  <div className="flex space-x-6 text-sm text-slate-500 font-medium tracking-wide">
                     <span>Apr 15</span>
                     <span>10:30</span>
                     <span className="text-slate-800 font-semibold">Court 2</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <CreateTournamentModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <EditTournamentModal tournament={mockTournament} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
      <ManageMatchesModal tournament={mockTournament} isOpen={isManageMatchesModalOpen} onClose={() => setIsManageMatchesModalOpen(false)} />
      <RegisterTeamModal isOpen={isRegisterTeamModalOpen} onClose={() => setIsRegisterTeamModalOpen(false)} />
    </div>
  );
}
