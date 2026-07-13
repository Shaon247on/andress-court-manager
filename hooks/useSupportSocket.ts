// hooks/useSupportSocket.ts

"use client";

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getDecryptedAccessToken } from '@/actions/token.action';
import type { SocketReplyEvent, SocketStatusEvent, SocketTicketEvent } from '@/types/ManagerSupport.type';

const SOCKET_URL = 'https://api.athlongoapp.com';

interface UseSupportSocketProps {
  ticketCode?: string;
  onReply?: (data: SocketReplyEvent) => void;
  onStatus?: (data: SocketStatusEvent) => void;
  onNewTicket?: (ticket: SocketTicketEvent) => void;
}

export function useSupportSocket({
  ticketCode,
  onReply,
  onStatus,
  onNewTicket,
}: UseSupportSocketProps = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const initSocket = async () => {
      try {
        const token = await getDecryptedAccessToken();
        
        if (!token) {
          console.warn('No access token found for socket connection');
          return;
        }

        console.log('Token retrieved successfully, length:', token.length);

        const socket = io(SOCKET_URL, {
          transports: ['websocket'],
          auth: { token },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        socket.on('connect', () => {
          console.log('Support socket connected successfully');
          setIsConnected(true);
        });

        socket.on('disconnect', (reason) => {
          console.log('Support socket disconnected:', reason);
          setIsConnected(false);
        });

        socket.on('connect_error', (err) => {
          console.error('Socket connection error:', err.message);
          setIsConnected(false);
        });

        // ── Support Events ──
        socket.on('support_reply', (data: SocketReplyEvent) => {
          console.log('Support reply received:', data);
          if (onReply) onReply(data);
        });

        socket.on('support_status', (data: SocketStatusEvent) => {
          console.log('Support status updated:', data);
          if (onStatus) onStatus(data);
        });

        socket.on('support_ticket', (ticket: SocketTicketEvent) => {
          console.log('New support ticket:', ticket);
          if (onNewTicket) onNewTicket(ticket);
        });

        socketRef.current = socket;

      } catch (error) {
        console.error('Error initializing socket:', error);
      }
    };

    initSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [onReply, onStatus, onNewTicket]);

  return { socket: socketRef.current, isConnected };
}