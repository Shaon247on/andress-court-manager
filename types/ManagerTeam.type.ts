export interface TeamPermissions {
  schedule: boolean;
  customers: boolean;
  bookings: boolean;
  tournaments: boolean;
  revenue: boolean;
  support: boolean;
  court_management: boolean;
}

export interface TeamStaff {
  id: string;
  name: string;
  email: string;
  role_name: string;
  role_label: string;
  status: 'active' | 'pending' | 'inactive';
  permissions: TeamPermissions;
  permission_count: number;
  permission_labels: string[];
  last_login: string | null;
  created_at: string;
}

export interface TeamCards {
  active_staff: number;
  pending_staff: number;
}

export interface TeamListResponse {
  success: boolean;
  cards: TeamCards;
  staff: TeamStaff[];
}

export interface TeamRole {
  value: string;
  label: string;
}

export interface TeamRolesResponse {
  success: boolean;
  roles: TeamRole[];
}

export interface TeamStaffDetailResponse {
  success: boolean;
  staff: TeamStaff;
}

export interface CreateStaffPayload {
  name: string;
  email: string;
  role_name: string;
  permissions: TeamPermissions;
}

export interface CreateStaffResponse {
  success: boolean;
  message: string;
  staff: TeamStaff;
}

export interface EditStaffPayload {
  name: string;
  email: string;
  role_name: string;
  status: 'active' | 'pending' | 'inactive';
  permissions: TeamPermissions;
}

export interface EditStaffResponse {
  success: boolean;
  message: string;
  staff: TeamStaff;
}

export interface DeleteStaffResponse {
  success: boolean;
  message: string;
}