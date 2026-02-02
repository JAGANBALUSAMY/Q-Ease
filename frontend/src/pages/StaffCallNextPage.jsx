import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import api from '../utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { EmptyState, ListSkeleton } from '@/components/common';
import { 
  ArrowLeft,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  PlayCircle,
  PauseCircle,
  Loader2,
  AlertCircle,
  SkipForward,
  Volume2,
  RefreshCw,
  Ticket,
  AlertTriangle,
  Star,
  User
} from 'lucide-react';
import { cn, formatTime } from '@/lib/utils';

const StaffCallNextPage = () => {
  const { queueId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();
  
  const [queue, setQueue] = useState(null);
  const [pendingTokens, setPendingTokens] = useState([]);
  const [currentToken, setCurrentToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calling, setCalling] = useState(false);
  const [serving, setServing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQueueData();
  }, [queueId]);

  useEffect(() => {
    socket?.on('token-update', handleTokenUpdate);
    socket?.on('queue-update', handleQueueUpdate);

    return () => {
      socket?.off('token-update', handleTokenUpdate);
      socket?.off('queue-update', handleQueueUpdate);
    };
  }, [socket]);

  const loadQueueData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const queueResponse = await api.get(`/queues/${queueId}`);
      setQueue(queueResponse.data.data.queue);
      
      const tokensResponse = await api.get(`/queues/${queueId}/pending-tokens`);
      setPendingTokens(tokensResponse.data.data.tokens || []);
      
      const currentResponse = await api.get(`/queues/${queueId}/current-token`);
      setCurrentToken(currentResponse.data.data.token || null);
    } catch (err) {
      setError('Failed to load queue data');
      console.error('Error loading queue data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTokenUpdate = (data) => {
    if (data.queueId === queueId) {
      loadQueueData();
    }
  };

  const handleQueueUpdate = (data) => {
    if (data.queueId === queueId) {
      setQueue(prev => ({ ...prev, ...data }));
    }
  };

  const callNextToken = async () => {
    if (pendingTokens.length === 0) {
      setError('No tokens in queue');
      return;
    }

    setCalling(true);
    setError('');

    try {
      const response = await api.post(`/tokens/queue/${queueId}/call-next`);
      const { token } = response.data.data;
      
      setCurrentToken(token);
      setPendingTokens(prev => prev.filter(t => t.id !== token.id));
      
      // Play notification sound
      const audio = new Audio('/sounds/notification.mp3');
      audio.play().catch(() => {});

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Token Called', {
          body: `Token ${token.displayToken} has been called`,
          icon: '/favicon.ico'
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to call next token');
      console.error('Error calling next token:', err);
    } finally {
      setCalling(false);
    }
  };

  const skipToken = async (tokenId) => {
    if (!window.confirm('Are you sure you want to skip this token?')) return;

    try {
      await api.patch(`/tokens/${tokenId}/skip`);
      loadQueueData();
    } catch (err) {
      setError('Failed to skip token');
      console.error('Error skipping token:', err);
    }
  };

  const serveToken = async (tokenId) => {
    try {
      setServing(true);
      await api.patch(`/tokens/${tokenId}/serve`);
      loadQueueData();
    } catch (err) {
      setError('Failed to serve token');
      console.error('Error serving token:', err);
    } finally {
      setServing(false);
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'EMERGENCY':
        return { icon: AlertTriangle, label: 'Emergency', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
      case 'PRIORITY':
        return { icon: Star, label: 'Priority', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };
      default:
        return { icon: User, label: 'Normal', className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading queue data...</p>
        </div>
      </div>
    );
  }

  if (error && !queue) {
    return (
      <div className="min-h-[80vh] bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="p-4 bg-destructive/10 rounded-full w-fit mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadQueueData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-background">
      <div className="container-wide py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Queue Management</h1>
            {queue && (
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="text-muted-foreground">{queue.name}</span>
                <Badge variant={queue.isActive ? 'default' : 'secondary'}>
                  {queue.isActive ? (
                    <><PlayCircle className="h-3 w-3 mr-1" /> Active</>
                  ) : (
                    <><PauseCircle className="h-3 w-3 mr-1" /> Paused</>
                  )}
                </Badge>
                <Badge variant="outline">
                  <Users className="h-3 w-3 mr-1" />
                  {pendingTokens.length} waiting
                </Badge>
              </div>
            )}
          </div>
          <Button variant="outline" size="icon" onClick={loadQueueData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={() => setError('')} className="ml-auto">
              Dismiss
            </Button>
          </div>
        )}

        {/* Queue Paused Warning */}
        {!queue?.isActive && (
          <Card className="mb-6 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-full">
                <PauseCircle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-100">Queue Paused</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  This queue is currently paused. Resume the queue from the dashboard to call customers.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Currently Serving Section */}
          <Card className="lg:row-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Currently Serving
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentToken ? (
                <div className="space-y-6">
                  {/* Big Token Display */}
                  <div className="text-center p-8 bg-primary/5 rounded-xl border-2 border-primary/20">
                    <div className="text-6xl sm:text-7xl font-bold text-primary mb-4">
                      {currentToken.displayToken}
                    </div>
                    {(() => {
                      const priority = getPriorityBadge(currentToken.priority);
                      return (
                        <Badge className={cn("text-sm", priority.className)}>
                          <priority.icon className="h-3.5 w-3.5 mr-1" />
                          {priority.label}
                        </Badge>
                      );
                    })()}
                  </div>

                  {/* Token Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Position</span>
                      <span className="font-medium">#{currentToken.position}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Called At</span>
                      <span className="font-medium">
                        {new Date(currentToken.calledAt).toLocaleTimeString()}
                      </span>
                    </div>
                    {currentToken.customerName && (
                      <>
                        <Separator />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Customer</span>
                          <span className="font-medium">{currentToken.customerName}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Serve Button */}
                  <Button 
                    className="w-full h-12 text-lg gap-2"
                    variant="default"
                    onClick={() => serveToken(currentToken.id)}
                    disabled={serving}
                  >
                    {serving ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5" />
                    )}
                    Mark as Served
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 bg-muted rounded-full w-fit mx-auto mb-4">
                    <Ticket className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">No Token Being Served</h3>
                  <p className="text-muted-foreground mb-4">
                    Call the next customer from the queue
                  </p>
                  <Button 
                    size="lg"
                    onClick={callNextToken}
                    disabled={calling || pendingTokens.length === 0 || !queue?.isActive}
                    className="gap-2"
                  >
                    {calling ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Bell className="h-5 w-5" />
                    )}
                    Call Next Customer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Call Next Button */}
          <Card>
            <CardContent className="p-6">
              <Button 
                className="w-full h-16 text-xl gap-3"
                size="lg"
                onClick={callNextToken}
                disabled={calling || pendingTokens.length === 0 || !queue?.isActive}
              >
                {calling ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Calling...
                  </>
                ) : (
                  <>
                    <Bell className="h-6 w-6" />
                    Call Next Customer
                  </>
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-3">
                {pendingTokens.length === 0 
                  ? 'No customers waiting'
                  : `${pendingTokens.length} customer${pendingTokens.length !== 1 ? 's' : ''} waiting`
                }
              </p>
            </CardContent>
          </Card>

          {/* Pending Tokens */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pending Tokens
                </CardTitle>
                <Badge variant="secondary">{pendingTokens.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {pendingTokens.length > 0 ? (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {pendingTokens.map((token, index) => {
                    const priority = getPriorityBadge(token.priority);
                    return (
                      <div 
                        key={token.id} 
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border",
                          index === 0 && "bg-primary/5 border-primary/20"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                            index === 0 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted text-muted-foreground"
                          )}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{token.displayToken}</span>
                              <Badge variant="outline" className={cn("text-xs", priority.className)}>
                                {priority.label}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Issued: {new Date(token.issuedAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => skipToken(token.id)}
                        >
                          <SkipForward className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="p-3 bg-muted rounded-full w-fit mx-auto mb-3">
                    <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No tokens in queue</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffCallNextPage;
