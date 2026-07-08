'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddStaffModal, EditStaffModal } from './StaffModals';

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Pending';
  permissions: string[];
};

const initialStaff: StaffMember[] = [
  {
    id: '1',
    name: 'Emily Davis',
    email: 'emily@courtmanager.com',
    role: 'Receptionist',
    status: 'Active',
    permissions: ['Schedule', 'Customers', 'Bookings']
  },
  {
    id: '2',
    name: 'Robert Martinez',
    email: 'robert@courtmanager.com',
    role: 'Court Supervisor',
    status: 'Active',
    permissions: ['Schedule', 'Customers', 'Bookings', 'Tournaments']
  },
  {
    id: '3',
    name: 'Lisa Anderson',
    email: 'lisa@courtmanager.com',
    role: 'Assistant Manager',
    status: 'Pending',
    permissions: ['Schedule', 'Customers', 'Bookings', 'Tournaments', 'Revenue']
  }
];

export default function ManagerTeamPage() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const activeCount = staff.filter(s => s.status === 'Active').length;
  const pendingCount = staff.filter(s => s.status === 'Pending').length;

  return (
    <div className="h-full flex flex-col p-8 bg-white overflow-y-auto w-full">
      <div className="mb-6 flex flex-col space-y-1 shrink-0">
        <h1 className="text-3xl font-bold text-slate-900">Manager Team</h1>
        <p className="text-slate-500">Manage staff and permissions</p>
      </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 shrink-0">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="text-sm font-medium text-slate-500 mb-2">Active Staff</div>
              <div className="text-3xl font-bold text-slate-900">{activeCount}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="text-sm font-medium text-slate-500 mb-2">Pending Staff</div>
              <div className="text-3xl font-bold text-primary">{pendingCount}</div>
            </div>
          </div>
         
         <div className='flex flex-row justify-end mb-4'>
          <Button variant="primary" className="h-10 px-4 mt-auto" onClick={() => setIsAddModalOpen(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
            Add Staff
         </Button>
         </div>


      <div className="bg-white rounded-lg border border-slate-200 flex-1 flex flex-col">
        <div className="">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white border-b border-slate-200 text-xs text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4 tracking-widest">Name</th>
                <th className="px-6 py-4 tracking-widest">Email</th>
                <th className="px-6 py-4 tracking-widest">Role</th>
                <th className="px-6 py-4 tracking-widest">Permissions</th>
                <th className="px-6 py-4 tracking-widest">Status</th>
                <th className="px-6 py-4 tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {staff.map((member) => (
                 <tr key={member.id} className="hover:bg-slate-50/50">
                   <td className="px-6 py-6 font-bold text-slate-900">{member.name}</td>
                   <td className="px-6 py-6">
                      <div className="flex items-center text-slate-600 font-medium">
                         <Mail className="w-4 h-4 mr-2 text-slate-400" />
                         {member.email}
                      </div>
                   </td>
                   <td className="px-6 py-6">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                         {member.role}
                      </span>
                   </td>
                   <td className="px-6 py-6 whitespace-normal max-w-[300px]">
                      <div className="text-sm font-medium text-slate-700 mb-2">{member.permissions.length} permissions</div>
                      <div className="flex flex-wrap gap-1.5">
                         {member.permissions.map(perm => (
                           <span key={perm} className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">
                              {perm}
                           </span>
                         ))}
                      </div>
                   </td>
                   <td className="px-6 py-6">
                      {member.status === 'Active' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                           <CheckCircle className="w-3.5 h-3.5 mr-1" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                           <Clock className="w-3.5 h-3.5 mr-1" /> Pending
                        </span>
                      )}
                   </td>
                   <td className="px-6 py-6">
                      <div className="flex space-x-3 text-sm font-bold">
                         <button onClick={() => setEditingStaff(member)} className="text-blue-600 hover:text-blue-800 transition-colors">Edit</button>
                         <button className="text-red-500 hover:text-red-700 transition-colors">Remove</button>
                      </div>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddStaffModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      {editingStaff && <EditStaffModal staff={editingStaff} isOpen={!!editingStaff} onClose={() => setEditingStaff(null)} />}
    </div>
  );
}
