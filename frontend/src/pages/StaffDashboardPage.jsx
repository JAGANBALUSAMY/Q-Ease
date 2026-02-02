import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import api from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { StatsCard, EmptyState, QueueCardSkeleton } from '@/components/common';
import { 
  Bell,
  CheckCircle2,
  Clock,
  Zap,
  Users,
  PlayCircle,
  PauseCircle,
  Settings,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Ticket
} from 'lucide-react';
import { cn } from '@/lib/utils';

const StaffDashboardPage = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [queues, setQueues] = useState([]);
  const [stats, setStats] = useState({
    totalServed: 0,
    totalWaiting: 0,
    avgWaitTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [callingQueue, setCallingQueue] = useState(null);

  useEffect(() => {
    fetchStaffQueues();
    fetchStats();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleQueueUpdate = (data) => {
      setQueues(prevQueues =>
        prevQueues.map(q => q.id === data.queueId ? { ...q, ...data } : q)
      );
    };

    socket.on('queue-update', handleQueueUpdate);

    return () => {
      socket.off('queue-update', handleQueueUpdate);
    };
  }, [socket]);

  const fetchStaffQueues = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);
      const response = await api.get('/queues');
      setQueues(response.data.data.queues || []);
    } catch (err) {
      console.error('Error fetching queues:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/analytics/staff-stats');
      setStats(response.data.stats || stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleCallNext = async (queueId) => {
    try {
      setCallingQueue(queueId);
      await api.post(`/tokens/queue/${queueId}/call-next`);
      fetchStaffQueues();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to call next token');
    } finally {
      setCallingQueue(null);
    }
  };

  const handleToggleQueue = async (queueId, isActive) => {
    try {
      const action = isActive ? 'pause' : 'resume';
      await api.put(`/queues/${queueId}/${action}`);
      setQueues(prevQueues =>
        prevQueues.map(q => q.id === queueId ? { ...q, isActive: !isActive } : q)
      );
    } catch (err) {
      alert('Failed to toggle queue status');
    }
  };

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-[80vh] bg-background">
      <div className="container-wide py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Staff Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              {getGreeting()}, {user?.firstName || 'Staff'}! 👋
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => fetchStaffQueues(true)}
            disabled={refreshing}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <StatsCard
            title="Served Today"
            value={stats.totalServed}
            icon={CheckCircle2}
            description="Customers served"
            variant="success"
          />
          <StatsCard
            title="Currently Waiting"
            value={stats.totalWaiting}
            icon={Users}
            description="In all queues"
            variant="warning"
          />
          <StatsCard
            title="Avg Wait Time"
            value={`~${stats.avgWaitTime}m`}
            icon={Zap}
            description="Per customer"
            variant="info"
          />
        </div>

        {/* Queues Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Queues</h2>
            <Badge variant="secondary" className="text-sm">
              {queues.length} queue{queues.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <QueueCardSkeleton key={i} />
              ))}
            </div>
          ) : queues.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {queues.map(queue => (
                <Card key={queue.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{queue.name}</CardTitle>
                        <p className="text-sm text-muted-foreground truncate">
                          {queue.organisation?.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={queue.isActive}
                          onCheckedChange={() => handleToggleQueue(queue.id, queue.isActive)}
                        />
                        <Badge variant={queue.isActive ? 'default' : 'secondary'}>
                          {queue.isActive ? 'Active' : 'Paused'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Queue Stats */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {queue._count?.tokens || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Waiting</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {queue.currentToken || '—'}
                        </div>
                        <div className="text-xs text-muted-foreground">Current</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 gap-2"
                        onClick={() => handleCallNext(queue.id)}
                        disabled={!queue.isActive || queue._count?.tokens === 0 || callingQueue === queue.id}
                      >
                        {callingQueue === queue.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Bell className="h-4 w-4" />
                        )}
                        Call Next
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(`/staff/queue/${queue.id}`)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Queue Status Warning */}
                    {!queue.isActive && (
                      <div className="flex items-center gap-2 p-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                        <PauseCircle className="h-4 w-4" />
                        Queue is paused. Toggle to resume calling.
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Clock}
              title="No Queues Assigned"
              description="Contact your administrator to get assigned to queues"
            />
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 pt-8 border-t">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <Card 
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => navigate('/staff/walk-in')}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Ticket className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Register Walk-in</p>
                  <p className="text-sm text-muted-foreground">Add customer to queue</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => navigate('/profile')}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Settings</p>
                  <p className="text-sm text-muted-foreground">Manage preferences</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fetchStaffQueues(true)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <RefreshCw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Refresh Data</p>
                  <p className="text-sm text-muted-foreground">Sync latest updates</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardPage;
