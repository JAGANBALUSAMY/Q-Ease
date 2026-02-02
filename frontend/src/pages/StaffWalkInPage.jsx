import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Printer, 
  Plus, 
  Clock, 
  Users, 
  AlertCircle,
  CheckCircle,
  Zap,
  AlertTriangle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

const StaffWalkInPage = () => {
  const { queueId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [queue, setQueue] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [priority, setPriority] = useState('NORMAL');
  const [creating, setCreating] = useState(false);
  const [createdToken, setCreatedToken] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQueueDetails();
  }, [queueId]);

  const loadQueueDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/queues/${queueId}`);
      setQueue(response.data.data.queue);
    } catch (err) {
      setError('Failed to load queue details');
      console.error('Error loading queue:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateToken = async (e) => {
    e.preventDefault();
    
    if (!customerName.trim()) {
      setError('Customer name is required');
      return;
    }

    setCreating(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post(`/queues/${queueId}/tokens/walk-in`, {
        customerName: customerName.trim(),
        contactInfo: contactInfo.trim(),
        priority
      });
      
      const { token } = response.data.data;
      setCreatedToken(token);
      setSuccess(`Token ${token.displayToken} created successfully!`);
      
      // Reset form
      setCustomerName('');
      setContactInfo('');
      setPriority('NORMAL');
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create walk-in token';
      setError(errorMessage);
      console.error('Error creating walk-in token:', err);
    } finally {
      setCreating(false);
    }
  };

  const handlePrintToken = () => {
    window.print();
  };

  const handleNewToken = () => {
    setCreatedToken(null);
    setSuccess('');
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

  if (!queue) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">Queue Not Found</h2>
            <p className="text-muted-foreground">Unable to load queue details</p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-wide py-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Queue
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold">Walk-in Customer Registration</h1>
            <p className="text-muted-foreground mt-1">Create tokens for walk-in customers</p>
          </div>

          {/* Queue Info Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{queue.name}</h2>
                  <p className="text-muted-foreground">{queue.description}</p>
                </div>
                <Badge variant={queue.isActive ? "default" : "secondary"}>
                  {queue.isActive ? 'Active' : 'Paused'}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Waiting: {queue.waitingCount || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Avg: {queue.averageTime || 5} min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            {success}
          </div>
        )}

        {/* Queue Paused Warning */}
        {!queue.isActive ? (
          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
            <CardContent className="pt-6 text-center space-y-2">
              <AlertTriangle className="w-12 h-12 text-amber-600 dark:text-amber-400 mx-auto" />
              <h3 className="text-lg font-semibold">Queue Paused</h3>
              <p className="text-muted-foreground">
                This queue is currently paused. Please resume the queue to create walk-in tokens.
              </p>
            </CardContent>
          </Card>
        ) : createdToken ? (
          /* Token Created Success */
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="text-center pb-2">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <CardTitle>Token Created Successfully</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="inline-block bg-primary/10 rounded-2xl px-8 py-6">
                  <span className="text-5xl font-bold text-primary">{createdToken.displayToken}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Customer</p>
                  <p className="font-medium">{customerName || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Priority</p>
                  <Badge variant="outline">{getPriorityConfig(priority).label}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Position</p>
                  <p className="font-medium">#{createdToken.position}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Est. Wait</p>
                  <p className="font-medium">
                    ~{createdToken.estimatedTime ? 
                      Math.floor((new Date(createdToken.estimatedTime) - new Date()) / 60000) : 
                      (createdToken.position - 1) * (queue.averageTime || 5)} min
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handlePrintToken} variant="outline" className="flex-1">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Token
                </Button>
                <Button onClick={handleNewToken} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Another
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Walk-in Form */
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Create Walk-in Token</CardTitle>
                  <CardDescription>Enter customer details to generate a token</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateToken} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Customer Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="customerName"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Enter customer full name"
                          className="pl-10"
                          required
                          disabled={creating}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactInfo">Contact Information</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="contactInfo"
                          value={contactInfo}
                          onChange={(e) => setContactInfo(e.target.value)}
                          placeholder="Phone number or email (optional)"
                          className="pl-10"
                          disabled={creating}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Priority Level</Label>
                      <div className="grid gap-3">
                        {['NORMAL', 'PRIORITY', 'EMERGENCY'].map((level) => {
                          const config = getPriorityConfig(level);
                          const Icon = config.icon;
                          return (
                            <div
                              key={level}
                              className={cn(
                                "relative flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                                priority === level 
                                  ? config.bgColor + " ring-2 ring-offset-2 ring-primary"
                                  : "border-border hover:border-muted-foreground/50"
                              )}
                              onClick={() => setPriority(level)}
                            >
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                                priority === level ? config.bgColor : "bg-muted"
                              )}>
                                <Icon className={cn("w-5 h-5", config.color)} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium">{config.label}</p>
                                <p className="text-sm text-muted-foreground">{config.description}</p>
                              </div>
                              <div className={cn(
                                "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                                priority === level ? "border-primary bg-primary" : "border-muted-foreground/30"
                              )}>
                                {priority === level && (
                                  <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={creating}
                      className="w-full"
                      size="lg"
                    >
                      {creating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Creating Token...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Walk-in Token
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Queue Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average Service Time</span>
                    <span className="font-medium">{queue.averageTime || 5} min</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Waiting</span>
                    <span className="font-medium">{queue.waitingCount || 0} customers</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Queue Capacity</span>
                    <span className="font-medium">{queue.maxTokens || 'Unlimited'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Enter the customer's full name</li>
                    <li>Add contact information for notifications</li>
                    <li>Select appropriate priority level</li>
                    <li>Click "Create Walk-in Token" to generate</li>
                    <li>Provide printed token to customer</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffWalkInPage;
