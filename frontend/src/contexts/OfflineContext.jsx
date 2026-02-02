import React, { createContext, useContext, useState, useEffect } from 'react';

const OfflineContext = createContext();

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState([]);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  useEffect(() => {
    // Initialize from localStorage
    const savedActions = JSON.parse(localStorage.getItem('pendingActions') || '[]');
    setPendingActions(savedActions);
    
    // Event listeners for online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineBanner(false);
      processPendingActions();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineBanner(true);
      setTimeout(() => setShowOfflineBanner(false), 5000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Save pending actions to localStorage
    localStorage.setItem('pendingActions', JSON.stringify(pendingActions));
  }, [pendingActions]);

  const addToPendingActions = (action) => {
    const actionWithTimestamp = {
      ...action,
      timestamp: Date.now(),
      id: Math.random().toString(36).substring(7)
    };
    
    setPendingActions(prev => [...prev, actionWithTimestamp]);
  };

  const removeFromPendingActions = (actionId) => {
    setPendingActions(prev => prev.filter(action => action.id !== actionId));
  };

  const processPendingActions = async () => {
    if (pendingActions.length === 0) return;

    const processedActions = [];
    
    for (const action of pendingActions) {
      try {
        // Process each pending action
        switch (action.type) {
          case 'JOIN_QUEUE':
            // Re-attempt queue join
            await fetch(`/api/queues/${action.queueId}/join`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(action.data)
            });
            break;
            
          case 'UPDATE_PROFILE':
            // Re-attempt profile update
            await fetch('/api/users/profile', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(action.data)
            });
            break;
            
          // Add more action types as needed
        }
        
        processedActions.push(action.id);
      } catch (error) {
        console.error('Failed to process pending action:', error);
        // Keep action in queue for next attempt
      }
    }

    // Remove successfully processed actions
    setPendingActions(prev => 
      prev.filter(action => !processedActions.includes(action.id))
    );
  };

  const getOfflineData = (key) => {
    try {
      const data = localStorage.getItem(`offline_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading offline data:', error);
      return null;
    }
  };

  const setOfflineData = (key, data) => {
    try {
      localStorage.setItem(`offline_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  };

  const value = {
    isOnline,
    pendingActions,
    showOfflineBanner,
    addToPendingActions,
    removeFromPendingActions,
    processPendingActions,
    getOfflineData,
    setOfflineData
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
      {showOfflineBanner && (
        <div className="offline-banner">
          <span>⚠️ You are currently offline. Changes will be synced when you reconnect.</span>
        </div>
      )}
    </OfflineContext.Provider>
  );
};