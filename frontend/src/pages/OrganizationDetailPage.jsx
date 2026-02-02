import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
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
  Phone,
  Mail,
  CheckCircle,
  Building2,
  Ticket
} from 'lucide-react';
import { cn } from '@/lib/utils';

const OrganizationDetailPage = () => {
  const { orgCode } = useParams();
  const navigate = useNavigate();
  const { socket, joinOrganization, leaveOrganization } = useSocket();
  const [organization, setOrganization] = useState(null);
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrganization();
  }, [orgCode]);

  useEffect(() => {
    if (!socket || !organization) return;

    joinOrganization(organization.id);

    const handleQueueUpdate = (data) => {
      console.log('Queue update:', data);
      setQueues(prevQueues =>
        prevQueues.map(q => q.id === data.queueId ? { ...q, ...data } : q)
      );
    };

    socket.on('queue-update', handleQueueUpdate);

    return () => {
      socket.off('queue-update', handleQueueUpdate);
      leaveOrganization(organization.id);
    };
  }, [socket, organization]);

  const fetchOrganization = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/organisations/${orgCode}`);
      setOrganization(response.data.data.organisation);
      setQueues(response.data.data.organisation.queues || []);
    } catch (err) {
      console.error('Error fetching organization:', err);
      setError('Organization not found');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinQueue = async (queueId) => {
    try {
      const response = await api.post('/tokens', {
        queueId,
        priority: 'NORMAL'
      });
      navigate('/my-tokens');
    } catch (err) {
      console.error('Error joining queue:', err);
      alert(err.response?.data?.message || 'Failed to join queue');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading organization...</p>
        </div>
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">{error || 'Organization not found'}</h2>
            <p className="text-muted-foreground">The requested organization could not be found.</p>
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
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container-wide py-6 space-y-6 px-4">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Organization Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-primary">
                  {organization.name.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl font-bold">{organization.name}</h1>
                      {organization.isVerified && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    {organization.code && (
                      <p className="text-muted-foreground mt-1">
                        Code: <span className="font-mono font-medium">{organization.code}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Organization Details */}
            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              {organization.address && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="text-sm font-medium">{organization.address}</p>
                  </div>
                </div>
              )}

              {organization.phone && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{organization.phone}</p>
                  </div>
                </div>
              )}

              {organization.email && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{organization.email}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Queues Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Available Queues</h2>
              <p className="text-sm text-muted-foreground">
                {queues.length} queue{queues.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>

          {queues.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {queues.map(queue => (
                <Card key={queue.id} className="overflow-hidden">
                  <div className={cn(
                    "h-1",
                    queue.isActive ? "bg-green-500" : "bg-gray-300"
                  )} />
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{queue.name}</CardTitle>
                      <Badge variant={queue.isActive ? "default" : "secondary"} className="text-xs">
                        {queue.isActive ? 'Active' : 'Closed'}
                      </Badge>
                    </div>
                    {queue.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {queue.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-muted/50">
                        <Users className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Waiting</p>
                        <p className="font-semibold">{queue.waitingCount || 0}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <Ticket className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Current</p>
                        <p className="font-semibold text-primary">{queue.currentServing || '-'}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Est.</p>
                        <p className="font-semibold">~{queue.averageTime || 5}m</p>
                      </div>
                    </div>

                    <Button 
                      className="w-full"
                      onClick={() => handleJoinQueue(queue.id)}
                      disabled={!queue.isActive}
                    >
                      <Ticket className="w-4 h-4 mr-2" />
                      {queue.isActive ? 'Join Queue' : 'Queue Closed'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">No Active Queues</h3>
                  <p className="text-muted-foreground">
                    This organization doesn't have any active queues at the moment.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetailPage;
