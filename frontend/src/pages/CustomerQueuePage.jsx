import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  AlertCircle,
  MapPin,
  Ticket,
  LogIn
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CustomerQueuePage = () => {
  const { queueId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQueueDetails();
  }, [queueId]);

  const fetchQueueDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/queues/public/${queueId}`);
      setQueue(response.data.data.queue);
    } catch (err) {
      console.error('Error fetching queue:', err);
      setError('Queue not found or unavailable');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinQueue = async () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    try {
      setJoining(true);
      await api.post('/tokens', { queueId });
      navigate('/my-tokens');
    } catch (err) {
      console.error('Error joining queue:', err);
      const msg = err.response?.data?.message || 'Failed to join queue';
      alert(msg);
    } finally {
      setJoining(false);
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

  if (error || !queue) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">Oops!</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-lg py-6 space-y-6">
        {/* Header with Organization Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-semibold text-lg">{queue.organisationName}</h2>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{queue.organisationAddress}, {queue.organisationCity}</span>
                </div>
              </div>
              <Badge variant={queue.isActive ? "default" : "secondary"}>
                {queue.isActive ? 'Active' : 'Closed'}
              </Badge>
            </div>

            <Separator className="my-4" />

            <div>
              <h1 className="text-2xl font-bold">{queue.name}</h1>
              <p className="text-muted-foreground mt-1">{queue.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Queue Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-xs text-muted-foreground">Waiting</p>
              <p className="text-2xl font-bold">{queue.waitingCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-2">
                <Ticket className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-xs text-muted-foreground">Serving</p>
              <p className="text-2xl font-bold text-primary">{queue.currentServing || '-'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-xs text-muted-foreground">Avg Wait</p>
              <p className="text-2xl font-bold">~{queue.averageTime}m</p>
            </CardContent>
          </Card>
        </div>

        {/* Join Button */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Button 
              size="lg"
              className="w-full text-lg py-6"
              onClick={handleJoinQueue}
              disabled={joining || !queue.isActive}
            >
              {joining ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Joining...
                </>
              ) : (
                <>
                  <Ticket className="w-5 h-5 mr-2" />
                  Join Queue Now
                </>
              )}
            </Button>

            {!user && (
              <p className="text-center text-sm text-muted-foreground">
                <LogIn className="w-4 h-4 inline mr-1" />
                You'll need to sign in to join
              </p>
            )}

            {!queue.isActive && (
              <p className="text-center text-sm text-amber-600 dark:text-amber-400">
                This queue is currently not accepting new customers
              </p>
            )}
          </CardContent>
        </Card>

        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="w-full"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
};

export default CustomerQueuePage;
