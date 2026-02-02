import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import socketService from '../../services/socketService';
import api from '../../services/api';
import './QueueDisplay.css';

const QueueDisplay = ({ queueId: propQueueId }) => {
  const { queueId: paramQueueId } = useParams();
  const queueId = propQueueId || paramQueueId;

  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!queueId) return;

    // Fetch initial queue data
    const fetchQueue = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/queues/${queueId}`);
        setQueue(response.data.data.queue);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load queue');
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();

    // Connect to Socket.IO and join queue room
    socketService.connect();
    socketService.joinQueue(queueId);

    // Listen for queue updates
    socketService.onQueueUpdate((data) => {
      console.log('Queue update received:', data);

      if (data.queueId === queueId) {
        // Update queue data based on event type
        setQueue(prev => {
          if (!prev) return prev;

          switch (data.type) {
            case 'token-added':
              return {
                ...prev,
                waitingCount: (prev.waitingCount || 0) + 1
              };

            case 'token-called':
              return {
                ...prev,
                currentToken: data.currentToken || data.tokenId
              };

            case 'queue-paused':
              return {
                ...prev,
                isActive: false
              };

            case 'queue-resumed':
              return {
                ...prev,
                isActive: true
              };

            default:
              // Refresh queue data for other updates
              fetchQueue();
              return prev;
          }
        });
      }
    });

    // Cleanup
    return () => {
      socketService.leaveQueue(queueId);
      socketService.off('queue-update');
    };
  }, [queueId]);

  if (loading) {
    return (
      <div className="queue-display loading">
        <div className="spinner"></div>
        <p>Loading queue...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="queue-display error">
        <span className="error-icon">⚠️</span>
        <p>{error}</p>
      </div>
    );
  }

  if (!queue) {
    return (
      <div className="queue-display error">
        <p>Queue not found</p>
      </div>
    );
  }

  return (
    <div className={`queue-display ${!queue.isActive ? 'paused' : ''}`}>
      <div className="queue-header">
        <h2>{queue.name}</h2>
        {!queue.isActive && (
          <span className="status-badge paused">⏸️ Paused</span>
        )}
        {queue.isActive && (
          <span className="status-badge active">✅ Active</span>
        )}
      </div>

      <div className="queue-stats">
        <div className="stat-card">
          <div className="stat-icon">🎫</div>
          <div className="stat-content">
            <div className="stat-label">Current Token</div>
            <div className="stat-value">{queue.currentToken || 'None'}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-label">Waiting</div>
            <div className="stat-value">{queue.waitingCount || 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <div className="stat-label">Avg. Time</div>
            <div className="stat-value">{queue.averageTime || 10} min</div>
          </div>
        </div>
      </div>

      {queue.description && (
        <div className="queue-description">
          <p>{queue.description}</p>
        </div>
      )}

      <div className="real-time-indicator">
        <span className="pulse-dot"></span>
        <span>Live Updates</span>
      </div>
    </div>
  );
};

export default QueueDisplay;