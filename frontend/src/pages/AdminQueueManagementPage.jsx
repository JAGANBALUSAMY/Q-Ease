import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import api from '../utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchInput, EmptyState, QueueCardSkeleton } from '@/components/common';
import { 
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Clock,
  Users,
  Settings,
  Trash2,
  Edit,
  Eye,
  PlayCircle,
  PauseCircle,
  Loader2,
  AlertCircle,
  CheckCircle2,
  MoreVertical,
  RefreshCw
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const AdminQueueManagementPage = () => {
  const { queueId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, joinOrganization, leaveOrganization } = useSocket();

  // State for list view
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // State for form view
  const [queue, setQueue] = useState({
    name: '',
    description: '',
    averageTime: 5,
    maxTokens: 50,
    isActive: true,
    operatingHours: {
      start: '09:00',
      end: '17:00'
    },
    prioritySettings: {
      emergencyEnabled: true,
      priorityEnabled: true,
      maxPriorityPerDay: 10
    }
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  // Socket.IO Real-time Updates
  useEffect(() => {
    const orgId = user?.organisationId || user?.organisation?.id;

    if (orgId && !queueId) {
      joinOrganization(orgId);

      if (socket) {
        const handleOrgUpdate = (data) => {
          if (data.type === 'queue-created') {
            setQueues(prev => [data.queue, ...prev]);
          } else if (data.type === 'queue-updated') {
            setQueues(prev => prev.map(q => q.id === data.queueId ? { ...q, ...data.updates } : q));
          } else if (data.type === 'queue-deleted') {
            setQueues(prev => prev.filter(q => q.id !== data.queueId));
          }
        };

        socket.on('org-update', handleOrgUpdate);

        return () => {
          leaveOrganization(orgId);
          socket.off('org-update', handleOrgUpdate);
        };
      }
    }
  }, [user, socket, queueId]);

  // Initial data loading
  useEffect(() => {
    if (!queueId) {
      loadQueues();
    } else if (queueId === 'new') {
      setLoading(false);
      setQueue({
        name: '',
        description: '',
        averageTime: 5,
        maxTokens: 50,
        isActive: true,
        operatingHours: { start: '09:00', end: '17:00' },
        prioritySettings: { emergencyEnabled: true, priorityEnabled: true, maxPriorityPerDay: 10 }
      });
    } else {
      loadQueueDetails();
    }
  }, [queueId]);

  const loadQueues = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/queues');
      setQueues(response.data.data.queues || []);
    } catch (err) {
      setError('Failed to load queues');
      console.error('Error loading queues:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredQueues = queues.filter(q => {
    const matchesSearch = q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && q.isActive) ||
      (filterStatus === 'inactive' && !q.isActive);
    return matchesSearch && matchesStatus;
  });

  const toggleQueueStatus = async (id, isActive) => {
    try {
      const action = isActive ? 'pause' : 'resume';
      await api.put(`/queues/${id}/${action}`);
      await loadQueues();
    } catch (err) {
      setError('Failed to update queue status');
    }
  };

  const deleteQueue = async (id) => {
    if (!window.confirm('Are you sure you want to delete this queue? This action cannot be undone.')) return;

    try {
      await api.delete(`/queues/${id}`);
      await loadQueues();
    } catch (err) {
      setError('Failed to delete queue');
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setQueue(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setQueue(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (queueId === 'new') {
        const orgId = user?.organisationId || user?.organisation?.id;
        const payload = { ...queue, organisationId: orgId };

        if (!payload.organisationId) {
          setError('Organisation ID is missing. Please re-login.');
          setSaving(false);
          return;
        }

        await api.post('/queues', payload);
        setSuccess('Queue created successfully!');
        setTimeout(() => navigate('/admin/queues'), 1500);
      } else {
        await api.put(`/queues/${queueId}`, queue);
        setSuccess('Queue updated successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save queue');
    } finally {
      setSaving(false);
    }
  };

  // List View
  if (!queueId) {
    return (
      <div className="min-h-[80vh] bg-background">
        <div className="container-wide py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Queue Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage and configure service queues for your organization
              </p>
            </div>
            <Button onClick={() => navigate('/admin/queues/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Queue
            </Button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search queues..."
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={loadQueues}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Queues Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <QueueCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredQueues.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredQueues.map(queue => (
                <Card key={queue.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{queue.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {queue.description || 'No description'}
                        </CardDescription>
                      </div>
                      <Badge variant={queue.isActive ? 'default' : 'secondary'}>
                        {queue.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className="text-center">
                        <div className="text-xl font-bold">{queue.waitingCount || queue._count?.tokens || 0}</div>
                        <div className="text-xs text-muted-foreground">Waiting</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold">{queue.averageTime || queue.avgWaitTime || '~'}m</div>
                        <div className="text-xs text-muted-foreground">Avg Wait</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/admin/queues/${queue.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/admin/queues/${queue.id}/edit`)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toggleQueueStatus(queue.id, queue.isActive)}>
                            {queue.isActive ? (
                              <><PauseCircle className="h-4 w-4 mr-2" /> Pause Queue</>
                            ) : (
                              <><PlayCircle className="h-4 w-4 mr-2" /> Resume Queue</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => deleteQueue(queue.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Queue
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Clock}
              title="No Queues Found"
              description={searchTerm ? 'Try adjusting your search criteria' : 'Get started by creating your first queue'}
              action={
                !searchTerm && (
                  <Button onClick={() => navigate('/admin/queues/new')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Queue
                  </Button>
                )
              }
            />
          )}
        </div>
      </div>
    );
  }

  // Form View (Create/Edit)
  if (loading) {
    return (
      <div className="min-h-[80vh] bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading queue details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-background">
      <div className="container-wide py-6 sm:py-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/queues')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {queueId === 'new' ? 'Create New Queue' : 'Edit Queue'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {queueId === 'new' ? 'Set up a new service queue' : 'Update queue settings'}
            </p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>General queue details and description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Queue Name *</Label>
                <Input
                  id="name"
                  value={queue.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., General Services, Billing Counter"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={queue.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the service this queue provides"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Queue Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Queue Settings</CardTitle>
              <CardDescription>Configure queue behavior and limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="averageTime">Average Service Time (minutes)</Label>
                  <Input
                    id="averageTime"
                    type="number"
                    value={queue.averageTime}
                    onChange={(e) => handleInputChange('averageTime', parseInt(e.target.value))}
                    min="1"
                    max="120"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxTokens">Maximum Tokens Per Day</Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    value={queue.maxTokens}
                    onChange={(e) => handleInputChange('maxTokens', parseInt(e.target.value))}
                    min="1"
                    max="1000"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label htmlFor="isActive" className="text-base font-medium">Queue Status</Label>
                  <p className="text-sm text-muted-foreground">
                    {queue.isActive ? 'Queue is accepting new tokens' : 'Queue is paused'}
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={queue.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Operating Hours</CardTitle>
              <CardDescription>Set when this queue is open for service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Opening Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={queue.operatingHours?.start || '09:00'}
                    onChange={(e) => handleInputChange('operatingHours.start', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">Closing Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={queue.operatingHours?.end || '17:00'}
                    onChange={(e) => handleInputChange('operatingHours.end', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/queues')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                queueId === 'new' ? 'Create Queue' : 'Update Queue'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminQueueManagementPage;
