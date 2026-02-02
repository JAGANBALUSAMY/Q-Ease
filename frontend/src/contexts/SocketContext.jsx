import React, { createContext, useState, useContext, useEffect } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      // Disconnect socket if user logs out
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    // Create socket connection
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated]);

  // Helper functions for joining/leaving rooms
  const joinQueue = (queueId) => {
    if (socket && connected) {
      socket.emit('join-queue', queueId);
      console.log(`Joined queue room: ${queueId}`);
    }
  };

  const leaveQueue = (queueId) => {
    if (socket && connected) {
      socket.emit('leave-queue', queueId);
      console.log(`Left queue room: ${queueId}`);
    }
  };

  const joinToken = (tokenId) => {
    if (socket && connected) {
      socket.emit('join-token', tokenId);
      console.log(`Joined token room: ${tokenId}`);
    }
  };

  const leaveToken = (tokenId) => {
    if (socket && connected) {
      socket.emit('leave-token', tokenId);
      console.log(`Left token room: ${tokenId}`);
    }
  };

  const joinOrganization = (orgId) => {
    if (socket && connected) {
      socket.emit('join-organization', orgId);
      console.log(`Joined organization room: ${orgId}`);
    }
  };

  const leaveOrganization = (orgId) => {
    if (socket && connected) {
      socket.emit('leave-organization', orgId);
      console.log(`Left organization room: ${orgId}`);
    }
  };

  const value = {
    socket,
    connected,
    joinQueue,
    leaveQueue,
    joinToken,
    leaveToken,
    joinOrganization,
    leaveOrganization
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};