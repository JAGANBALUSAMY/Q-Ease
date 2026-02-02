import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import api from '../utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  AlertCircle,
  CheckCircle,
  Zap,
  AlertTriangle,
  Info,
  Ticket
} from 'lucide-react';
import { cn } from '@/lib/utils';

const QueueJoinPage = () => {
  const { queueId } = useParams();
  const { user } = useAuth();
  const { joinQueueRoom, leaveQueueRoom } = useSocket();
  const navigate = useNavigate();
  
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('NORMAL');

  useEffect(() => {
    loadQueueDetails();
    
    if (queueId) {
      joinQueueRoom(queueId);
    }

    return () => {
      if (queueId) {
        leaveQueueRoom(queueId);
      }
    };
  }, [queueId, joinQueueRoom, leaveQueueRoom]);

  const loadQueueDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.get(`/queues/${queueId}`);
      setQueue(response.data.data.queue);
    } catch (err) {
      setError('Failed to load queue details');
      console.error('Error loading queue:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinQueue = async () => {
    if (!queue) return;

    setJoining(true);
    setError('');

    try {
      const response = await api.post(`/queues/${queueId}/tokens`, {
        priority: selectedPriority
      });
      
      const { token } = response.data.data;
      
      navigate(`/track/${token.id}`, { 
        state: { 
          token,
          queueName: queue.name 
        } 
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join queue');
      console.error('Error joining queue:', err);
    } finally {
      setJoining(false);
    }
  };

  const getPriorityConfig = (level) => {
    switch (level) {
      case 'PRIORITY': 
        return {
          label: 'Priority',
          description: 'For customers with appointments or special needs',
          icon: Zap,
          color: 'text-amber-600 dark:text-amber-400',
          bgColor: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
        };
      case 'EMERGENCY': 
        return {
          label: 'Emergency',
          description: 'For urgent cases only',
          icon: AlertTriangle,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        };
      default: 
        return {
          label: 'Normal',
          description: 'Standard queue service',
          icon: Users,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading queue details...</p>
        </div>
      </div>
    );
  }

  if (error && !queue) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={loadQueueDetails}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!queue) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
            <h2 className="text-xl font-semibold">Queue Not Found</h2>
            <p className="text-muted-foreground">The requested queue could not be found.</p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl py-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold">{queue.name}</h1>
            <p className="text-muted-foreground mt-1">{queue.description}</p>
          </div>
        </div>

        {/* Queue Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Queue Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  queue.isActive ? "bg-green-500" : "bg-red-500"
                )} />
                <span className="font-medium">
                  {queue.isActive ? 'Active' : 'Closed'}
                </span>
              </div>
              <Badge variant={queue.isActive ? "default" : "secondary"}>
                {queue.isActive ? 'Open for joining' : 'Not accepting tokens'}
              </Badge>
            </div>
            
            <Separator className="my-4" />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Users className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">People waiting</p>
                  <p className="font-semibold">{queue.waitingCount || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Est. wait time</p>
                  <p className="font-semibold">{queue.estimatedWaitTime || queue.averageTime || 5} min</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Queue Closed Message */}
        {!queue.isActive ? (
          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
            <CardContent className="pt-6 text-center space-y-3">
              <AlertTriangle className="w-12 h-12 text-amber-600 dark:text-amber-400 mx-auto" />
              <h3 className="text-lg font-semibold">Queue Closed</h3>
              <p className="text-muted-foreground">
                This queue is currently not accepting new tokens.
                Please try again later or contact the service counter.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Join Queue Section */}
            <Card>
              <CardHeader>
                <CardTitle>Join Queue</CardTitle>
                <CardDescription>Select your priority level and join the queue</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Priority Selection */}
                <div className="space-y-3">
                  <h3 className="font-medium">Select Priority Level</h3>
                  <div className="grid gap-3">
                    {['NORMAL', 'PRIORITY', 'EMERGENCY'].map((level) => {
                      const config = getPriorityConfig(level);
                      const Icon = config.icon;
                      return (
                        <div
                          key={level}
                          className={cn(
                            "relative flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                            selectedPriority === level 
                              ? config.bgColor + " ring-2 ring-offset-2 ring-primary"
                              : "border-border hover:border-muted-foreground/50"
                          )}
                          onClick={() => setSelectedPriority(level)}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                            selectedPriority === level ? config.bgColor : "bg-muted"
                          )}>
                            <Icon className={cn("w-5 h-5", config.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{config.label}</p>
                            <p className="text-sm text-muted-foreground">{config.description}</p>
                          </div>
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                            selectedPriority === level ? "border-primary bg-primary" : "border-muted-foreground/30"
                          )}>
                            {selectedPriority === level && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                {/* Join Button */}
                <Button 
                  onClick={handleJoinQueue}
                  disabled={joining}
                  className="w-full"
                  size="lg"
                >
                  {joining ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Joining Queue...
                    </>
                  ) : (
                    <>
                      <Ticket className="w-4 h-4 mr-2" />
                      Join Queue ({getPriorityConfig(selectedPriority).label})
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Terms Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Terms & Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">By joining this queue, you agree to:</p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    Arrive at the service counter when your token is called
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    Keep your mobile device available for notifications
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    Cancel your token if you can no longer wait
                  </li>
                </ul>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default QueueJoinPage;
