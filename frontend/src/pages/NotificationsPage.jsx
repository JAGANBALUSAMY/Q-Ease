import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { EmptyState, ListSkeleton } from '@/components/common';
import { 
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  Clock,
  Ticket,
  AlertCircle,
  Info,
  ArrowLeft,
  RefreshCw,
  Settings,
  Filter
} from 'lucide-react';
import { cn, formatTime } from '@/lib/utils';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Mock notifications for demo
  const mockNotifications = [
    {
      id: 1,
      type: 'token_called',
      title: 'Your token is being called!',
      message: 'Token #A-042 is now being called at Counter 3. Please proceed immediately.',
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'queue_update',
      title: 'Queue position updated',
      message: 'You are now #3 in the queue at City Medical Center.',
      timestamp: new Date(Date.now() - 15 * 60000),
      read: false,
      priority: 'normal'
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Your turn is coming up',
      message: 'You will be called in approximately 10 minutes. Please stay nearby.',
      timestamp: new Date(Date.now() - 30 * 60000),
      read: true,
      priority: 'normal'
    },
    {
      id: 4,
      type: 'system',
      title: 'Welcome to Q-Ease!',
      message: 'Thank you for joining Q-Ease. Start by searching for organizations near you.',
      timestamp: new Date(Date.now() - 2 * 3600000),
      read: true,
      priority: 'low'
    }
  ];

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(mockNotifications);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'token_called':
        return { icon: Bell, color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30' };
      case 'queue_update':
        return { icon: Ticket, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' };
      case 'reminder':
        return { icon: Clock, color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30' };
      case 'system':
        return { icon: Info, color: 'text-gray-500 bg-gray-100 dark:bg-gray-800' };
      default:
        return { icon: Bell, color: 'text-primary bg-primary/10' };
    }
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce((groups, notif) => {
    const date = notif.timestamp.toDateString();
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    let label;
    if (date === today) label = 'Today';
    else if (date === yesterday) label = 'Yesterday';
    else label = notif.timestamp.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

    if (!groups[label]) groups[label] = [];
    groups[label].push(notif);
    return groups;
  }, {});

  return (
    <div className="min-h-[80vh] bg-background">
      <div className="container-wide py-6 sm:py-8 max-w-3xl">
        {/* Page Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchNotifications(true)}
              disabled={refreshing}
            >
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigate('/profile')}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Actions Bar */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between gap-4 mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all" className="gap-2">
                  All
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                    {notifications.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="unread" className="gap-2">
                  Unread
                  {unreadCount > 0 && (
                    <Badge className="h-5 px-1.5 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark all read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={clearAll}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear all
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Notifications List */}
        {loading ? (
          <ListSkeleton count={4} />
        ) : filteredNotifications.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedNotifications).map(([date, notifs]) => (
              <div key={date}>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">{date}</h3>
                <div className="space-y-2">
                  {notifs.map((notif) => {
                    const { icon: Icon, color } = getNotificationIcon(notif.type);
                    return (
                      <Card
                        key={notif.id}
                        className={cn(
                          "transition-all duration-200",
                          !notif.read && "border-l-4 border-l-primary bg-primary/5"
                        )}
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className={cn("p-2.5 rounded-lg shrink-0 h-fit", color)}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className={cn(
                                  "font-medium",
                                  !notif.read && "text-foreground",
                                  notif.read && "text-muted-foreground"
                                )}>
                                  {notif.title}
                                </h4>
                                <span className="text-xs text-muted-foreground shrink-0">
                                  {formatTimestamp(notif.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {notif.message}
                              </p>
                              <div className="flex items-center gap-2">
                                {!notif.read && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-7 text-xs"
                                    onClick={() => markAsRead(notif.id)}
                                  >
                                    <Check className="h-3 w-3 mr-1" />
                                    Mark as read
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 text-xs text-destructive hover:text-destructive"
                                  onClick={() => deleteNotification(notif.id)}
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={activeTab === 'unread' ? CheckCheck : BellOff}
            title={activeTab === 'unread' ? "All Caught Up!" : "No Notifications"}
            description={
              activeTab === 'unread'
                ? "You've read all your notifications. Great job staying on top of things!"
                : "You don't have any notifications yet. They will appear here when you receive them."
            }
            action={
              activeTab === 'unread' && notifications.length > 0 && (
                <Button variant="outline" onClick={() => setActiveTab('all')}>
                  View All Notifications
                </Button>
              )
            }
          />
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
