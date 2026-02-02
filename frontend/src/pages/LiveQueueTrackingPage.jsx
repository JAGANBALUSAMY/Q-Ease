import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import api from '../utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  AlertCircle,
  Bell,
  RefreshCw,
  Volume2,
  XCircle,
  Ticket,
  MapPin,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const LiveQueueTrackingPage = () => {
  const { tokenId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { joinQueueRoom, leaveQueueRoom, socket } = useSocket();
  const audioRef = useRef(null);
  
  const [token, setToken] = useState(location.state?.token || null);
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(!token);
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Initialize audio
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      audioRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, []);

  useEffect(() => {
    if (tokenId) {
      loadTokenDetails();
    }
  }, [tokenId]);

  useEffect(() => {
    if (token?.queueId) {
      joinQueueRoom(token.queueId);
      
      socket?.on('token-update', handleTokenUpdate);
      socket?.on('token-called', handleTokenCalled);
      socket?.on('queue-update', handleQueueUpdate);
    }

    return () => {
      if (token?.queueId) {
        leaveQueueRoom(token.queueId);
        socket?.off('token-update', handleTokenUpdate);
        socket?.off('token-called', handleTokenCalled);
        socket?.off('queue-update', handleQueueUpdate);
      }
    };
  }, [token?.queueId, joinQueueRoom, leaveQueueRoom, socket]);

  useEffect(() => {
    let interval;
    if (token?.estimatedTime) {
      interval = setInterval(() => {
        const now = new Date();
        const estimated = new Date(token.estimatedTime);
        const diff = Math.max(0, Math.floor((estimated - now) / 60000));
        setTimeRemaining(diff);
      }, 60000);
      
      const now = new Date();
      const estimated = new Date(token.estimatedTime);
      const diff = Math.max(0, Math.floor((estimated - now) / 60000));
      setTimeRemaining(diff);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [token?.estimatedTime]);

  const playAlertSound = () => {
    try {
      if (audioRef.current) {
        const oscillator = audioRef.current.createOscillator();
        const gainNode = audioRef.current.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioRef.current.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioRef.current.currentTime + 0.5);
        
        oscillator.start(audioRef.current.currentTime);
        oscillator.stop(audioRef.current.currentTime + 0.5);
      }
    } catch (err) {
      console.log('Audio alert failed:', err);
    }
  };

  const loadTokenDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.get(`/users/me/tokens/${tokenId}`);
      const tokenData = response.data.data.token;
      setToken(tokenData);
      
      const queueResponse = await api.get(`/queues/${tokenData.queueId}`);
      setQueue(queueResponse.data.data.queue);
      
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load token details');
      console.error('Error loading token:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await loadTokenDetails();
  };

  const handleTokenUpdate = (data) => {
    if (data.tokenId === tokenId) {
      setToken(prev => ({ ...prev, ...data }));
      setLastUpdated(new Date());
    }
  };

  const handleTokenCalled = (data) => {
    if (data.tokenId === tokenId) {
      setToken(prev => ({ ...prev, status: 'CALLED' }));
      setLastUpdated(new Date());
      
      playAlertSound();
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Your token has been called!', {
          body: `Please proceed to ${queue?.name || 'the service counter'}`,
          icon: '/favicon.ico'
        });
      }
    }
  };

  const handleQueueUpdate = (data) => {
    if (token?.queueId === data.queueId) {
      setQueue(prev => ({ ...prev, ...data }));
      setLastUpdated(new Date());
    }
  };

  const cancelToken = async () => {
    if (!window.confirm('Are you sure you want to cancel your token?')) return;

    try {
      await api.put(`/tokens/${tokenId}/cancel`);
      navigate('/');
    } catch (err) {
      setError('Failed to cancel token');
      console.error('Error cancelling token:', err);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'CALLED':
        return { 
          color: 'bg-amber-500', 
          text: 'Your token has been called!', 
          variant: 'warning',
          icon: Bell
        };
      case 'SERVED':
        return { 
          color: 'bg-green-500', 
          text: 'Service completed', 
          variant: 'success',
          icon: CheckCircle
        };
      case 'CANCELLED':
        return { 
          color: 'bg-red-500', 
          text: 'Cancelled', 
          variant: 'destructive',
          icon: XCircle
        };
      case 'MISSED':
        return { 
          color: 'bg-orange-500', 
          text: 'Missed turn', 
          variant: 'warning',
          icon: AlertCircle
        };
      default:
        return { 
          color: 'bg-blue-500', 
          text: 'Waiting in queue', 
          variant: 'default',
          icon: Clock
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading token details...</p>
        </div>
      </div>
    );
  }

  if (error && !token) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={loadTokenDetails}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <Ticket className="w-12 h-12 text-muted-foreground mx-auto" />
            <h2 className="text-xl font-semibold">Token Not Found</h2>
            <p className="text-muted-foreground">The requested token could not be found.</p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = getStatusConfig(token.status);
  const StatusIcon = statusConfig.icon;
  const progressPercent = Math.max(0, 100 - ((token.position - 1) * 10));

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container max-w-lg py-6 space-y-6 px-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Queue Tracking</h1>
            <span className="text-xs text-muted-foreground">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Your token is being tracked in real-time</p>
        </div>

        {/* Token Display Card */}
        <Card className={cn(
          "overflow-hidden",
          token.status === 'CALLED' && "ring-2 ring-amber-500 animate-pulse"
        )}>
          <div className={cn("h-2", statusConfig.color)} />
          <CardContent className="pt-6 text-center space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Your Token</p>
              <div className="inline-block bg-primary/10 rounded-2xl px-10 py-6">
                <span className="text-5xl font-bold text-primary">{token.displayToken}</span>
              </div>
            </div>
            
            <Badge 
              variant={statusConfig.variant === 'warning' ? 'outline' : statusConfig.variant}
              className={cn(
                "text-sm px-4 py-1",
                token.status === 'CALLED' && "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400"
              )}
            >
              <StatusIcon className="w-4 h-4 mr-2" />
              {statusConfig.text}
            </Badge>
          </CardContent>
        </Card>

        {/* Queue Information */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Queue Information</CardTitle>
              <Button variant="ghost" size="sm" onClick={refreshData}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Service</p>
                  <p className="font-medium text-sm">{location.state?.queueName || queue?.name || 'Loading...'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Your Position</p>
                  <p className="font-medium text-sm">#{token.position}</p>
                </div>
              </div>
              {timeRemaining > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Est. Wait</p>
                    <p className="font-medium text-sm">~{timeRemaining} min</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Users className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Waiting</p>
                  <p className="font-medium text-sm">{queue?.waitingCount || '...'}</p>
                </div>
              </div>
            </div>

            {queue?.currentToken && (
              <>
                <Separator />
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Currently Serving</p>
                  <p className="text-lg font-bold text-primary">{queue.currentToken}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Progress Section */}
        {token.status === 'PENDING' && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Progress value={progressPercent} className="h-3" />
              <p className="text-sm text-center text-muted-foreground">
                You are {token.position > 1 ? `${token.position - 1} people` : 'next'} away from being served
              </p>
            </CardContent>
          </Card>
        )}

        {/* Called Alert */}
        {token.status === 'CALLED' && (
          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mx-auto animate-bounce">
                <Bell className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold">You've Been Called!</h3>
              <p className="text-muted-foreground">
                Please proceed to the service counter immediately.
              </p>
              <p className="font-medium">
                Counter: {queue?.name || 'Main Counter'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {token.status === 'PENDING' && (
            <Button 
              variant="outline" 
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={cancelToken}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cancel Token
            </Button>
          )}
          
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => navigate('/')}
          >
            <Ticket className="w-4 h-4 mr-2" />
            Get New Token
          </Button>
        </div>

        {/* Notifications Section */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">We'll notify you when your token is called</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  if ('Notification' in window) {
                    Notification.requestPermission();
                  }
                }}
              >
                <Bell className="w-4 h-4 mr-2" />
                Enable Notifications
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={playAlertSound}
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Test Audio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveQueueTrackingPage;
