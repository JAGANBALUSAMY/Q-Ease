import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import api from '../utils/api';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TokenCard, EmptyState, TokenCardSkeleton } from '@/components/common';
import { 
  Plus, 
  Clock, 
  History, 
  AlertCircle, 
  RefreshCw,
  Ticket,
  CheckCircle2,
  XCircle,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MyTokensPage = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTokens();
  }, []);

  // Socket.IO real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleTokenUpdate = (data) => {
      console.log('Token update received:', data);
      setTokens(prevTokens =>
        prevTokens.map(token =>
          token.id === data.tokenId
            ? { ...token, ...data }
            : token
        )
      );
    };

    socket.on('token-update', handleTokenUpdate);

    tokens.forEach(token => {
      socket.emit('join-token', token.id);
    });

    return () => {
      socket.off('token-update', handleTokenUpdate);
      tokens.forEach(token => {
        socket.emit('leave-token', token.id);
      });
    };
  }, [socket, tokens]);

  const fetchTokens = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const response = await api.get('/tokens/my');
      setTokens(response.data.tokens || []);
    } catch (err) {
      console.error('Error fetching tokens:', err);
      setError('Failed to load tokens. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCancelToken = async (tokenId) => {
    if (!window.confirm('Are you sure you want to cancel this token?')) {
      return;
    }

    try {
      await api.patch(`/tokens/${tokenId}/cancel`);
      setTokens(prevTokens =>
        prevTokens.map(token =>
          token.id === tokenId
            ? { ...token, status: 'CANCELLED', cancelledAt: new Date() }
            : token
        )
      );
    } catch (err) {
      console.error('Error cancelling token:', err);
      alert('Failed to cancel token. Please try again.');
    }
  };

  const activeTokens = tokens.filter(t =>
    t.status === 'PENDING' || t.status === 'CALLED'
  );

  const historyTokens = tokens.filter(t =>
    t.status === 'SERVED' || t.status === 'CANCELLED'
  );

  const calledTokens = activeTokens.filter(t => t.status === 'CALLED');

  // Stats
  const stats = [
    { 
      label: 'Active', 
      value: activeTokens.length, 
      icon: Clock, 
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' 
    },
    { 
      label: 'Called', 
      value: calledTokens.length, 
      icon: Bell, 
      color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' 
    },
    { 
      label: 'Served', 
      value: tokens.filter(t => t.status === 'SERVED').length, 
      icon: CheckCircle2, 
      color: 'text-green-600 bg-green-100 dark:bg-green-900/30' 
    },
    { 
      label: 'Cancelled', 
      value: tokens.filter(t => t.status === 'CANCELLED').length, 
      icon: XCircle, 
      color: 'text-gray-600 bg-gray-100 dark:bg-gray-800' 
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[80vh] bg-background">
        <div className="container-wide py-6 sm:py-8">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="space-y-2">
              <div className="h-8 w-40 bg-muted animate-pulse rounded-md" />
              <div className="h-4 w-64 bg-muted animate-pulse rounded-md" />
            </div>
            <div className="h-10 w-36 bg-muted animate-pulse rounded-md" />
          </div>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>

          {/* Tabs Skeleton */}
          <div className="h-10 w-64 bg-muted animate-pulse rounded-md mb-6" />

          {/* Cards Skeleton */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <TokenCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-background">
      <div className="container-wide py-6 sm:py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Tokens</h1>
            <p className="text-muted-foreground mt-1">
              Track your queue positions and get real-time updates
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchTokens(true)}
              disabled={refreshing}
              className="shrink-0"
            >
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            </Button>
            <Button onClick={() => navigate('/')}>
              <Plus className="h-4 w-4 mr-2" />
              Join New Queue
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2.5 rounded-lg", stat.color)}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Called Token Alert */}
        {calledTokens.length > 0 && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-full">
                <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400 animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                  Your token is being called!
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  {calledTokens.length === 1 
                    ? `Token ${calledTokens[0].tokenNumber} is ready. Please proceed to the counter.`
                    : `You have ${calledTokens.length} tokens being called. Please proceed to the counters.`
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fetchTokens()}
              className="shrink-0"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex h-auto p-1 mb-6">
            <TabsTrigger value="active" className="gap-2 py-2.5">
              <Clock className="h-4 w-4" />
              Active
              {activeTokens.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {activeTokens.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2 py-2.5">
              <History className="h-4 w-4" />
              History
              {historyTokens.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {historyTokens.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-0">
            {activeTokens.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeTokens.map(token => (
                  <TokenCard
                    key={token.id}
                    token={token}
                    onCancel={handleCancelToken}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Ticket}
                title="No Active Tokens"
                description="You don't have any active tokens. Join a queue to get started!"
                action={
                  <Button onClick={() => navigate('/')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Browse Organizations
                  </Button>
                }
              />
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            {historyTokens.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {historyTokens.map(token => (
                  <TokenCard
                    key={token.id}
                    token={token}
                    variant="history"
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={History}
                title="No Token History"
                description="Your completed and cancelled tokens will appear here."
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyTokensPage;
