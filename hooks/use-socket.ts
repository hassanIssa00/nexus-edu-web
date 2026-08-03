import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    // Initialize socket
    // Namespace is /chat as defined in Gateway
    socketRef.current = io(`${SOCKET_URL}/chat`, {
        auth: { token },
        transports: ['websocket'],
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
        setIsConnected(true);
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
    });

    return () => {
        socket.disconnect();
    };
  }, []);

  return { socket: socketRef.current, isConnected };
}
