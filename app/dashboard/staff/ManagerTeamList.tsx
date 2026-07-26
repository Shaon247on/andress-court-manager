"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, CheckCircle, Clock, MoreVertical, Eye, Edit2, Trash2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AddStaffModal, EditStaffModal } from './StaffModals';
import { deleteStaffAction } from '@/actions/manager-team.action';
import type { TeamStaff, TeamCards, TeamRole } from '@/types/ManagerTeam.type';
import { toast } from 'sonner';

interface ManagerTeamListProps {
  staff: TeamStaff[];
  cards: TeamCards | null;
  roles: TeamRole[];
  errorMessage?: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'active') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
      <Clock className="w-3.5 h-3.5 mr-1" /> Pending
    </span>
  );
};

export default function ManagerTeamList({
  staff = [],
  cards = null,
  roles = [],
  errorMessage,
}: ManagerTeamListProps) {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<TeamStaff | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingStaff, setDeletingStaff] = useState<TeamStaff | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const activeCount = cards?.active_staff ?? staff.filter(s => s.status === 'active').length;
  const pendingCount = cards?.pending_staff ?? staff.filter(s => s.status === 'pending').length;

  if (errorMessage) {
    return (
      <div className="h-full flex flex-col p-8 bg-white overflow-y-auto w-full">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!deletingStaff) return;
    setIsDeleting(true);
    const res = await deleteStaffAction(deletingStaff.id);
    if (res.success) {
      toast.success(res.data.message);
      setDeleteDialogOpen(false);
      setDeletingStaff(null);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setIsDeleting(false);
  };

  const openDeleteDialog = (staff: TeamStaff) => {
    setDeletingStaff(staff);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 bg-white overflow-y-auto w-full">
      <div className="mb-6 flex flex-col space-y-1 shrink-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Manager Team</h1>
        <p className="text-slate-500">Manage staff and permissions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 shrink-0">
        <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6">
          <div className="text-sm font-medium text-slate-500 mb-1 sm:mb-2">Active Staff</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">{activeCount}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6">
          <div className="text-sm font-medium text-slate-500 mb-1 sm:mb-2">Pending Staff</div>
          <div className="text-2xl sm:text-3xl font-bold text-primary">{pendingCount}</div>
        </div>
      </div>

      <div className="flex justify-end mb-4 shrink-0">
        <Button variant="primary" className="h-10 px-4" onClick={() => setIsAddModalOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Staff
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 flex-1 flex flex-col overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white border-b border-slate-200 text-xs text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 sm:px-6 py-4 tracking-widest">Name</th>
                <th className="px-4 sm:px-6 py-4 tracking-widest hidden sm:table-cell">Email</th>
                <th className="px-4 sm:px-6 py-4 tracking-widest">Role</th>
                <th className="px-4 sm:px-6 py-4 tracking-widest hidden md:table-cell">Permissions</th>
                <th className="px-4 sm:px-6 py-4 tracking-widest">Status</th>
                <th className="px-4 sm:px-6 py-4 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No staff members found.
                  </td>
                </tr>
              ) : (
                staff.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/50">
                    <td className="px-4 sm:px-6 py-4 sm:py-6 font-bold text-slate-900">
                      {member.name}
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-6 hidden sm:table-cell">
                      <div className="flex items-center text-slate-600 font-medium">
                        <Mail className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[150px]">{member.email}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-6">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                        {member.role_label}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-6 hidden md:table-cell whitespace-normal max-w-[200px]">
                      <div className="flex flex-wrap gap-1.5">
                        {member.permission_labels.map(perm => (
                          <span key={perm} className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">
                            {perm}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-6">
                      <StatusBadge status={member.status} />
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/team/${member.id}`} className="flex items-center gap-2 cursor-pointer">
                              <Eye className="w-4 h-4" />
                              <span>View Details</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditingStaff(member)} className="flex items-center gap-2 cursor-pointer">
                            <Edit2 className="w-4 h-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => openDeleteDialog(member)}
                            className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Remove</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddStaffModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        roles={roles}
      />
      
      {editingStaff && (
        <EditStaffModal 
          staff={editingStaff}
          isOpen={!!editingStaff} 
          onClose={() => setEditingStaff(null)}
          roles={roles}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Staff Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <span className="font-semibold">{deletingStaff?.name}</span> from your team?
              <br />
              <span className="text-sm text-slate-500">This action cannot be undone.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" /> : null}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}