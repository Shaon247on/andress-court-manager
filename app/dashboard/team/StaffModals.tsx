// app/dashboard/team/StaffModals.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { createStaffAction, editStaffAction } from '@/actions/manager-team.action';
import type { TeamStaff, TeamRole, TeamPermissions } from '@/types/ManagerTeam.type';
import { toast } from 'sonner';

const PERMISSIONS = [
  { value: 'schedule', label: 'Schedule' },
  { value: 'customers', label: 'Customers' },
  { value: 'bookings', label: 'Bookings' },
  { value: 'tournaments', label: 'Tournaments' },
  { value: 'revenue', label: 'Revenue' },
  { value: 'support', label: 'Help & Support' },
  { value: 'court_management', label: 'Court Management' },
];

const DEFAULT_PERMISSIONS: TeamPermissions = {
  schedule: false,
  customers: false,
  bookings: false,
  tournaments: false,
  revenue: false,
  support: false,
  court_management: false,
};

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: TeamRole[];
}

export function AddStaffModal({ isOpen, onClose, roles }: AddStaffModalProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState<TeamPermissions>(DEFAULT_PERMISSIONS);

  const resetForm = () => {
    setName('');
    setEmail('');
    setRoleName('');
    setPermissions(DEFAULT_PERMISSIONS);
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const togglePermission = (key: keyof TeamPermissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !roleName) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    const res = await createStaffAction({
      name,
      email,
      role_name: roleName,
      permissions,
    });

    if (res.success) {
      toast.success(res.data.message);
      resetForm();
      onClose();
      window.location.reload();
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

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
        className="bg-white rounded-xl shadow-xl w-full max-w-[440px] relative z-10 flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold text-slate-900">Add Staff</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input 
              className="h-10" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input 
              className="h-10" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">
              Role <span className="text-red-500">*</span>
            </Label>
            <Select value={roleName} onValueChange={setRoleName}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-semibold text-slate-700 mb-3 block">
              Access Permissions
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PERMISSIONS.map((p) => (
                <label key={p.value} className="flex items-center space-x-2 cursor-pointer group">
                  <Checkbox
                    checked={permissions[p.value as keyof TeamPermissions]}
                    onCheckedChange={() => togglePermission(p.value as keyof TeamPermissions)}
                    className="rounded border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-sm font-medium text-slate-700">{p.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end space-x-3 shrink-0">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Send Invite
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: TeamStaff;
  roles: TeamRole[];
  onSuccess?: () => void;
}

export function EditStaffModal({ isOpen, onClose, staff, roles, onSuccess }: EditStaffModalProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(staff?.name || '');
  const [email, setEmail] = useState(staff?.email || '');
  const [roleName, setRoleName] = useState(staff?.role_name || '');
  const [status, setStatus] = useState<'active' | 'pending' | 'inactive'>(staff?.status || 'pending');
  const [permissions, setPermissions] = useState<TeamPermissions>(
    staff?.permissions || DEFAULT_PERMISSIONS
  );

  useEffect(() => {
    if (staff) {
      setName(staff.name);
      setEmail(staff.email);
      setRoleName(staff.role_name);
      setStatus(staff.status);
      setPermissions(staff.permissions);
    }
  }, [staff]);

  const togglePermission = (key: keyof TeamPermissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async () => {
    if (!staff) return;
    if (!name.trim() || !email.trim() || !roleName) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    const res = await editStaffAction(staff.id, {
      name,
      email,
      role_name: roleName,
      status,
      permissions,
    });

    if (res.success) {
      toast.success(res.data.message);
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
        window.location.reload();
      }
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

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
        className="bg-white rounded-xl shadow-xl w-full max-w-[440px] relative z-10 flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold text-slate-900">Edit Staff Member</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input 
              className="h-10" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input 
              className="h-10" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">
              Role <span className="text-red-500">*</span>
            </Label>
            <Select value={roleName} onValueChange={setRoleName}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">
              Status <span className="text-red-500">*</span>
            </Label>
            <Select value={status} onValueChange={(val) => setStatus(val as 'active' | 'pending' | 'inactive')}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-semibold text-slate-700 mb-3 block">
              Access Permissions
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PERMISSIONS.map((p) => (
                <label key={p.value} className="flex items-center space-x-2 cursor-pointer group">
                  <Checkbox
                    checked={permissions[p.value as keyof TeamPermissions]}
                    onCheckedChange={() => togglePermission(p.value as keyof TeamPermissions)}
                    className="rounded border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-sm font-medium text-slate-700">{p.label}</span>
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

        <div className="p-6 border-t border-slate-100 flex justify-end space-x-3 shrink-0">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Save Changes
          </Button>
        </div>
      </motion.div>
    </div>
  );
}