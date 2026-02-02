import { io } from 'socket.io-client';

/**
 * Socket.IO Client Service
 * Manages real-time connections for queue updates
 */

class SocketService {
    constructor() {
        this.socket = null;
        this.connected = false;
    }

    // Initialize socket connection
    connect() {
        if (this.socket?.connected) {
            console.log('Socket already connected');
            return this.socket;
        }

        const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        this.socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });

        this.socket.on('connect', () => {
            console.log('✅ Socket connected:', this.socket.id);
            this.connected = true;
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
            this.connected = false;
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return this.socket;
    }

    // Disconnect socket
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
            console.log('Socket disconnected');
        }
    }

    // Join organization room
    joinOrganisation(orgId) {
        if (!this.socket) this.connect();
        this.socket.emit('join-organisation', orgId);
        console.log(`Joined organisation room: org-${orgId}`);
    }

    // Leave organization room
    leaveOrganisation(orgId) {
        if (this.socket) {
            this.socket.emit('leave-organisation', orgId);
            console.log(`Left organisation room: org-${orgId}`);
        }
    }

    // Join queue room
    joinQueue(queueId) {
        if (!this.socket) this.connect();
        this.socket.emit('join-queue', queueId);
        console.log(`Joined queue room: queue-${queueId}`);
    }

    // Leave queue room
    leaveQueue(queueId) {
        if (this.socket) {
            this.socket.emit('leave-queue', queueId);
            console.log(`Left queue room: queue-${queueId}`);
        }
    }

    // Join token room (for tracking specific token)
    joinToken(tokenId) {
        if (!this.socket) this.connect();
        this.socket.emit('join-token', tokenId);
        console.log(`Joined token room: token-${tokenId}`);
    }

    // Leave token room
    leaveToken(tokenId) {
        if (this.socket) {
            this.socket.emit('leave-token', tokenId);
            console.log(`Left token room: token-${tokenId}`);
        }
    }

    // Listen for queue updates
    onQueueUpdate(callback) {
        if (!this.socket) this.connect();
        this.socket.on('queue-update', callback);
    }

    // Listen for token updates
    onTokenUpdate(callback) {
        if (!this.socket) this.connect();
        this.socket.on('token-update', callback);
    }

    // Listen for organization updates
    onOrgUpdate(callback) {
        if (!this.socket) this.connect();
        this.socket.on('org-update', callback);
    }

    // Remove all listeners for an event
    off(event) {
        if (this.socket) {
            this.socket.off(event);
        }
    }

    // Get socket instance
    getSocket() {
        if (!this.socket) this.connect();
        return this.socket;
    }

    // Check if connected
    isConnected() {
        return this.connected && this.socket?.connected;
    }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
