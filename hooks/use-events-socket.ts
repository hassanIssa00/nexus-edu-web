import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useEventsSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    if (!token) return;

    socketRef.current = io(`${SOCKET_URL}/events`, {
        auth: { token },
        transports: ['websocket'],
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
        console.log('Events Socket connected:', socket.id);
        setIsConnected(true);
    });

    socket.on('disconnect', () => {
        console.log('Events Socket disconnected');
        setIsConnected(false);
    });

    return () => {
        socket.disconnect();
    };
  }, []);

  return { socket: socketRef.current, isConnected };
}
