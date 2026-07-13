// types/Support.type.ts

export interface SupportCategory {
  value: string;
  label: string;
}

export interface SupportStatus {
  value: string;
  label: string;
}

export interface SupportSender {
  id: string;
  name: string;
  role: string;
  is_staff: boolean;
}

export interface SupportThreadItem {
  id: string;
  message: string;
  created_at: string;
  is_opening: boolean;
  sender: SupportSender;
}

export interface SupportTicket {
  code: string;
  subject: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved';
  locked: boolean;
  created_at: string;
  updated_at: string;
  reply_count: number;
}

export interface SupportTicketDetail {
  ticket: SupportTicket;
  thread: SupportThreadItem[];
}

export interface SupportTicketResponse {
  success: boolean;
  message: string;
  ticket: SupportTicket;
}

export interface SupportTicketsListResponse {
  success: boolean;
  tickets: SupportTicket[];
  pagination?: {
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export interface SupportTicketDetailResponse {
  success: boolean;
  ticket: SupportTicket;
  thread: SupportThreadItem[];
}

export interface SupportReplyPayload {
  message: string;
}

export interface SupportReplyResponse {
  success: boolean;
  message: string;
  ticket: SupportTicket;
  thread: SupportThreadItem[];
}

export interface CreateSupportTicketPayload {
  subject: string;
  message: string;
  category: string;
}

export interface SupportQuery {
  status?: 'open' | 'in_progress' | 'resolved';
  page?: number;
}

// ── Socket Event Types ──

export interface SocketReplyEvent {
  ticket_code: string;
  reply: SupportThreadItem;
  status: string;
}

export interface SocketStatusEvent {
  code: string;
  status: string;
  locked: boolean;
}