import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { StatsCard, EmptyState, QueueCardSkeleton } from '@/components/common';
import { 
  Clock,
  Ticket,
  Users,
  Zap,
  Plus,
  Settings,
  BarChart3,
  UserCog,
  Bell,
  ArrowRight,
  RefreshCw,
  PlayCircle,
  PauseCircle,
  Shield,
  Activity,
  TrendingUp,
  CalendarDays
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalQueues: 0,
    totalTokens: 0,
    activeUsers: 0,
    avgWaitTime: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [callingQueue, setCallingQueue] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      const [statsRes, activityRes, queuesRes] = await Promise.all([
        api.get('/analytics/admin-stats'),
        api.get('/analytics/recent-activity'),
        api.get('/queues')
      ]);

      setStats(statsRes.data.stats || stats);
      setRecentActivity(activityRes.data.activity || []);
      setQueues(queuesRes.data.data.queues || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  const handleCallNext = async (queueId) => {
    try {
      setCallingQueue(queueId);
      await api.post(`/tokens/queue/${queueId}/call-next`);
      const response = await api.get('/queues');
      setQueues(response.data.data.queues || []);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to call next token');
    } finally {
      setCallingQueue(null);
    }
  };

  const quickActions = [
    {
      title: 'Create Queue',
      description: 'Add a new service queue',
      icon: Plus,
      color: 'bg-primary/10 text-primary',
      onClick: () => navigate('/admin/queues/new')
    },
    {
      title: 'Manage Staff',
      description: 'View and manage staff members',
      icon: UserCog,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      onClick: () => navigate('/admin/users')
    },
    {
      title: 'View Analytics',
      description: 'Performance metrics & reports',
      icon: BarChart3,
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      onClick: () => navigate('/admin/analytics')
    },
    {
      title: 'Settings',
      description: 'Configure organization',
      icon: Settings,
      color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
      onClick: () => navigate('/admin/settings')
    }
  ];

  // Add Super Admin action
  if (user?.role === 'SUPER_ADMIN') {
    quickActions.unshift({
      title: 'Manage Admins',
      description: 'Organization administrators',
      icon: Shield,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      onClick: () => navigate('/admin/admins')
    });
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'token_created': return Ticket;
      case 'token_called': return Bell;
      case 'queue_created': return Plus;
      default: return Activity;
    }
  };

  return (
    <div className="min-h-[80vh] bg-background">
      <div className="container-wide py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {user?.role === 'SUPER_ADMIN' ? 'Super Admin Dashboard' : 'Admin Dashboard'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {getGreeting()}, {user?.firstName || 'Admin'}! 👋
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Queues"
            value={stats.totalQueues}
            icon={Clock}
            description="Service queues"
            variant="default"
          />
          <StatsCard
            title="Tokens Issued"
            value={stats.totalTokens}
            icon={Ticket}
            description="Today"
            variant="success"
            trend={12}
          />
          <StatsCard
            title="Active Users"
            value={stats.activeUsers}
            icon={Users}
            description="Currently online"
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Queues Section - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Queues</h2>
              <Button variant="outline" size="sm" onClick={() => navigate('/admin/queues')}>
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2].map(i => (
                  <QueueCardSkeleton key={i} />
                ))}
              </div>
            ) : queues.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {queues.slice(0, 4).map(queue => (
                  <Card key={queue.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate">{queue.name}</CardTitle>
                          <CardDescription className="truncate">
                            {queue.organisation?.name}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={queue.isActive}
                            onCheckedChange={() => handleToggleQueue(queue.id, queue.isActive)}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="text-center">
                          <div className="text-xl font-bold text-primary">
                            {queue._count?.tokens || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">Waiting</div>
                        </div>
                        <Separator orientation="vertical" className="h-8" />
                        <div className="text-center">
                          <div className="text-xl font-bold">
                            {queue.averageTime || '~'}m
                          </div>
                          <div className="text-xs text-muted-foreground">Avg Wait</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          className="flex-1 gap-2"
                          size="sm"
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
                          size="sm"
                          onClick={() => navigate(`/admin/queues/${queue.id}`)}
                        >
                          Manage
                        </Button>
                      </div>

                      {!queue.isActive && (
                        <div className="flex items-center gap-2 p-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                          <PauseCircle className="h-4 w-4" />
                          Queue is paused
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8">
                  <EmptyState
                    icon={Clock}
                    title="No Queues Found"
                    description="Create your first queue to get started"
                    action={
                      <Button onClick={() => navigate('/admin/queues/new')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Queue
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Quick Actions & Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.slice(0, 4).map((action, index) => (
                  <Card 
                    key={index}
                    className="cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={action.onClick}
                  >
                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                      <div className={cn("p-2.5 rounded-lg", action.color)}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{action.title}</p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.slice(0, 5).map((activity, index) => {
                      const Icon = getActivityIcon(activity.type);
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <div className="p-2 bg-muted rounded-full shrink-0">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{activity.description}</p>
                            <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Today's Summary */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <span className="font-medium">Today's Summary</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold">{stats.totalTokens}</p>
                    <p className="text-xs text-muted-foreground">Tokens issued</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      {stats.avgWaitTime}m
                    </p>
                    <p className="text-xs text-muted-foreground">Avg wait time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
