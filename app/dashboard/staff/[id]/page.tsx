// app/dashboard/team/[id]/page.tsx

import { notFound } from "next/navigation";
import StaffDetails from "./StaffDetails";
import { getStaffDetailsAction, getTeamRolesAction } from "@/actions/manager-team.action";

export default async function StaffDetailsPage({
  params,
}: {
  params?: Promise<{ id: string }>;
}) {
  const { id } = await params || { id: '' };
  
  if (!id) {
    notFound();
  }

  const [staffRes, rolesRes] = await Promise.all([
    getStaffDetailsAction(id),
    getTeamRolesAction(),
  ]);
  
  if (!staffRes.success || !staffRes.data) {
    notFound();
  }

  const roles = rolesRes.success ? rolesRes.data.roles : [];

  return <StaffDetails staff={staffRes.data.staff} roles={roles} />;
}