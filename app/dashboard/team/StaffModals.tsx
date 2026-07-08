'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { StaffMember } from './page';

const ALL_PERMISSIONS = ['Schedule', 'Customers', 'Bookings', 'Tournaments', 'Revenue', 'Help & Support'];

export function AddStaffModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-[400px] relative z-10 flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Add Staff</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-5 h-5" />
            </button>
        </div>
        
        <div className="p-6 space-y-5 overflow-y-auto">
           <div>
             <label className="block text-sm font-semibold text-slate-700 mb-2">Name *</label>
             <Input className="h-10" />
           </div>
           <div>
             <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
             <Input className="h-10" />
           </div>
           <div>
             <label className="block text-sm font-semibold text-slate-700 mb-2">Role Name *</label>
             <Input className="h-10" placeholder="e.g. Receptionist, Manager" />
           </div>
           <div>
             <label className="block text-sm font-semibold text-slate-700 mb-3">Access Permissions</label>
             <div className="space-y-3">
               {ALL_PERMISSIONS.map(p => (
                 <label key={p} className="flex items-center space-x-3 cursor-pointer group">
                   <div className="w-4 h-4 rounded border-2 border-slate-300 flex items-center justify-center transition-colors group-hover:border-primary">
                     {/* Checkbox mock */}
                   </div>
                   <span className="text-sm font-medium text-slate-700">{p}</span>
                 </label>
               ))}
             </div>
           </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end space-x-3">
           <Button variant="secondary" onClick={onClose}>Cancel</Button>
           <Button variant="primary" onClick={onClose}>Send Invite</Button>
        </div>
      </motion.div>
    </div>
  );
}

export function EditStaffModal({ isOpen, onClose, staff }: { isOpen: boolean, onClose: () => void, staff: StaffMember }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-[400px] relative z-10 flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Edit Staff Member</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-5 h-5" />
            </button>
        </div>
        
        <div className="p-6 space-y-5 overflow-y-auto">
           <div>
             <label className="block text-sm font-semibold text-slate-700 mb-2">Name *</label>
             <Input className="h-10" defaultValue={staff.name} />
           </div>
           <div>
             <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
             <Input className="h-10" defaultValue={staff.email} />
           </div>
           <div>
             <label className="block text-sm font-semibold text-slate-700 mb-2">Role Name *</label>
             <Input className="h-10" defaultValue={staff.role} />
           </div>
           <div>
             <label className="block text-sm font-semibold text-slate-700 mb-2">Status *</label>
             <select className="w-full flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
               <option>Active</option>
               <option>Pending</option>
             </select>
           </div>
           <div>
             <label className="block text-sm font-semibold text-slate-700 mb-2">Access Permissions</label>
             <div className="border border-slate-200 rounded-lg p-4 space-y-4">
               {ALL_PERMISSIONS.slice(0,4).map(p => (
                 <label key={p} className="flex items-center space-x-3 cursor-pointer group">
                   <div className="text-sm font-medium text-slate-700 ml-5">{p}</div>
                 </label>
               ))}
             </div>
           </div>

           <div className="bg-green-50 border border-primary/40 rounded-lg p-4">
             <p className="text-xs text-primary/80 leading-relaxed font-medium">
               <strong className="text-primary">Note:</strong> Changes will take effect immediately. The staff member may need to log out and log back in to see updated permissions.
             </p>
           </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end space-x-3">
           <Button variant="secondary" onClick={onClose}>Cancel</Button>
           <Button variant="primary" onClick={onClose}>Save Changes</Button>
        </div>
      </motion.div>
    </div>
  );
}
