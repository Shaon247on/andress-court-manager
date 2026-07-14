// app/dashboard/team/[id]/StaffDetails.tsx

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Mail, 
  Calendar, 
  Clock, 
  CheckCircle, 
  User, 
  Shield, 
  Key,
  Edit2,
  Trash2,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { EditStaffModal } from '../StaffModals';
import { deleteStaffAction } from '@/actions/manager-team.action';
import type { TeamStaff, TeamRole } from '@/types/ManagerTeam.type';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface StaffDetailsProps {
  staff: TeamStaff;
  roles: TeamRole[];
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    active: { label: 'Active', className: 'bg-green-100 text-green-800 border-green-200' },
    pending: { label: 'Pending', className: 'bg-orange-100 text-orange-800 border-orange-200' },
    inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-800 border-gray-200' },
  };
  const { label, className } = statusMap[status] || statusMap.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      {label}
    </span>
  );
};

const PermissionBadge = ({ label, value }: { label: string; value: boolean }) => {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
      value 
        ? 'bg-green-50 border-green-200 text-green-700' 
        : 'bg-gray-50 border-gray-200 text-gray-400'
    }`}>
      <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-gray-300'}`} />
      <span className={`text-sm font-medium ${value ? 'text-green-700' : 'text-gray-400'}`}>
        {label}
      </span>
      {value && <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />}
    </div>
  );
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Never';
  try {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  } catch {
    return dateString;
  }
};

export default function StaffDetails({ staff, roles }: StaffDetailsProps) {
  const router = useRouter();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const permissionLabels: Record<string, string> = {
    schedule: 'Schedule',
    customers: 'Customers',
    bookings: 'Bookings',
    tournaments: 'Tournaments',
    revenue: 'Revenue',
    support: 'Help & Support',
    court_management: 'Court Management',
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteStaffAction(staff.id);
    if (res.success) {
      toast.success(res.data.message);
      setDeleteDialogOpen(false);
      router.push('/dashboard/team');
      router.refresh();
    } else {
      toast.error(res.message);
      setIsDeleting(false);
    }
  };

  const handleEditSuccess = () => {
    setEditModalOpen(false);
    router.refresh();
  };

  return (
    <>
      <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 bg-white overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/team"
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {staff.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-2">
                <Mail className="w-3 h-3" />
                {staff.email}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={staff.status} />
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8"
              onClick={() => setEditModalOpen(true)}
            >
              <Edit2 className="w-3 h-3 mr-1.5" />
              Edit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Staff Information */}
            <Card className="border border-slate-200 shadow-none">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Staff Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Full Name</p>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">{staff.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Email</p>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">{staff.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Role</p>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        {staff.role_label}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Status</p>
                    <div className="mt-0.5">
                      <StatusBadge status={staff.status} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Permissions */}
            <Card className="border border-slate-200 shadow-none">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Access Permissions
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {staff.permission_count} of {Object.keys(staff.permissions).length}
                  </Badge>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(staff.permissions).map(([key, value]) => (
                    <PermissionBadge 
                      key={key}
                      label={permissionLabels[key] || key}
                      value={value}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="border border-slate-200 shadow-none">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Permission Count</span>
                    <span className="text-sm font-bold text-slate-900">{staff.permission_count}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Last Login</span>
                    <span className="text-sm font-medium text-slate-900">{formatDate(staff.last_login)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Joined</span>
                    <span className="text-sm font-medium text-slate-900">{formatDate(staff.created_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border border-slate-200 shadow-none">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Actions</h3>
                <div className="flex flex-col md:flex-row items-center gap-2">
                  <Button 
                    variant="blue" 
                    className="w-full"
                    onClick={() => setEditModalOpen(true)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Staff
                  </Button>
                  <Button 
                    variant="danger" 
                    className="w-full"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Staff
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditStaffModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        staff={staff}
        roles={roles}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Staff Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <span className="font-semibold">{staff.name}</span> from your team?
              <br />
              <span className="text-sm text-slate-500">This action cannot be undone.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}