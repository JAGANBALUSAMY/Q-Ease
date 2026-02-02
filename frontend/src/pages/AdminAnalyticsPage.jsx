import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ArrowLeft, 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Download,
  RefreshCw,
  AlertCircle,
  Smile,
  Activity,
  Target,
  Zap,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminAnalyticsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [analyticsData, setAnalyticsData] = useState({
    realtime: {},
    historical: {},
    staff: {},
    customer: {},
    operational: {},
    overview: {}
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('7d');
  const [refreshInterval, setRefreshInterval] = useState(null);

  useEffect(() => {
    loadAnalyticsData();
    
    const interval = setInterval(() => {
      if (activeTab === 'realtime') {
        loadRealtimeData();
      }
    }, 30000);
    
    setRefreshInterval(interval);
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [activeTab, dateRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError('');
      
      switch(activeTab) {
        case 'realtime':
          await loadRealtimeData();
          break;
        case 'historical':
          await loadHistoricalData();
          break;
        case 'staff':
          await loadStaffData();
          break;
        case 'customer':
          await loadCustomerData();
          break;
        case 'operational':
          await loadOperationalData();
          break;
        default:
          await loadOverviewData();
      }
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRealtimeData = async () => {
    try {
      const [overviewRes, queuesRes, alertsRes] = await Promise.all([
        api.get('/analytics/realtime/overview'),
        api.get('/analytics/realtime/queues'),
        api.get('/analytics/realtime/alerts')
      ]);
      
      setAnalyticsData(prev => ({
        ...prev,
        realtime: {
          overview: overviewRes.data.data,
          queues: queuesRes.data.data,
          alerts: alertsRes.data.data
        }
      }));
    } catch (err) {
      console.error('Error loading realtime data:', err);
    }
  };

  const loadHistoricalData = async () => {
    try {
      const [performanceRes, trendsRes, comparisonRes] = await Promise.all([
        api.get(`/analytics/historical/performance?range=${dateRange}`),
        api.get(`/analytics/historical/trends?range=${dateRange}`),
        api.get(`/analytics/historical/comparison?range=${dateRange}`)
      ]);
      
      setAnalyticsData(prev => ({
        ...prev,
        historical: {
          performance: performanceRes.data.data,
          trends: trendsRes.data.data,
          comparison: comparisonRes.data.data
        }
      }));
    } catch (err) {
      console.error('Error loading historical data:', err);
    }
  };

  const loadStaffData = async () => {
    try {
      const [performanceRes, rankingsRes, trainingRes] = await Promise.all([
        api.get('/analytics/staff/performance'),
        api.get('/analytics/staff/rankings'),
        api.get('/analytics/staff/training')
      ]);
      
      setAnalyticsData(prev => ({
        ...prev,
        staff: {
          performance: performanceRes.data.data,
          rankings: rankingsRes.data.data,
          training: trainingRes.data.data
        }
      }));
    } catch (err) {
      console.error('Error loading staff data:', err);
    }
  };

  const loadCustomerData = async () => {
    try {
      const [satisfactionRes, segmentsRes, behaviorRes] = await Promise.all([
        api.get('/analytics/customer/satisfaction'),
        api.get('/analytics/customer/segments'),
        api.get('/analytics/customer/behavior')
      ]);
      
      setAnalyticsData(prev => ({
        ...prev,
        customer: {
          satisfaction: satisfactionRes.data.data,
          segments: segmentsRes.data.data,
          behavior: behaviorRes.data.data
        }
      }));
    } catch (err) {
      console.error('Error loading customer data:', err);
    }
  };

  const loadOperationalData = async () => {
    try {
      const [efficiencyRes, costsRes, resourcesRes] = await Promise.all([
        api.get('/analytics/operational/efficiency'),
        api.get('/analytics/operational/costs'),
        api.get('/analytics/operational/resources')
      ]);
      
      setAnalyticsData(prev => ({
        ...prev,
        operational: {
          efficiency: efficiencyRes.data.data,
          costs: costsRes.data.data,
          resources: resourcesRes.data.data
        }
      }));
    } catch (err) {
      console.error('Error loading operational data:', err);
    }
  };

  const loadOverviewData = async () => {
    try {
      const overviewRes = await api.get('/analytics/overview');
      setAnalyticsData(prev => ({
        ...prev,
        overview: overviewRes.data.data
      }));
    } catch (err) {
      console.error('Error loading overview data:', err);
    }
  };

  const handleExport = async (format = 'csv') => {
    try {
      const response = await api.get(`/analytics/export?format=${format}&tab=${activeTab}&range=${dateRange}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics-${activeTab}-${dateRange}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to export data');
      console.error('Export error:', err);
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue" }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {trendValue && (
              <div className={cn(
                "flex items-center gap-1 text-sm",
                trend === 'up' ? "text-green-600" : trend === 'down' ? "text-red-600" : "text-muted-foreground"
              )}>
                {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : trend === 'down' ? <TrendingDown className="w-4 h-4" /> : null}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            color === "blue" && "bg-blue-100 dark:bg-blue-900/30",
            color === "green" && "bg-green-100 dark:bg-green-900/30",
            color === "amber" && "bg-amber-100 dark:bg-amber-900/30",
            color === "purple" && "bg-purple-100 dark:bg-purple-900/30"
          )}>
            <Icon className={cn(
              "w-6 h-6",
              color === "blue" && "text-blue-600 dark:text-blue-400",
              color === "green" && "text-green-600 dark:text-green-400",
              color === "amber" && "text-amber-600 dark:text-amber-400",
              color === "purple" && "text-purple-600 dark:text-purple-400"
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading && !analyticsData.overview) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-wide py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="gap-2 -ml-2 mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Monitor performance and track key metrics</p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Today</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                <Download className="w-4 h-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                <FileText className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4 hidden sm:block" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="realtime" className="gap-2">
              <Activity className="w-4 h-4 hidden sm:block" />
              Real-time
            </TabsTrigger>
            <TabsTrigger value="historical" className="gap-2">
              <TrendingUp className="w-4 h-4 hidden sm:block" />
              Historical
            </TabsTrigger>
            <TabsTrigger value="staff" className="gap-2">
              <Users className="w-4 h-4 hidden sm:block" />
              Staff
            </TabsTrigger>
            <TabsTrigger value="customer" className="gap-2">
              <Smile className="w-4 h-4 hidden sm:block" />
              Customer
            </TabsTrigger>
            <TabsTrigger value="operational" className="gap-2">
              <Target className="w-4 h-4 hidden sm:block" />
              Operational
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Total Served Today" 
                value={analyticsData.overview?.totalServedToday || 156}
                icon={Users}
                trend="up"
                trendValue="12% from yesterday"
                color="blue"
              />
              <StatCard 
                title="Avg Wait Time" 
                value={`${analyticsData.overview?.avgWaitTime || 12} min`}
                icon={Clock}
                trend="down"
                trendValue="2 min from target"
                color="amber"
              />
              <StatCard 
                title="Satisfaction" 
                value={`${analyticsData.overview?.satisfactionScore || 4.5}/5`}
                icon={Smile}
                trend="up"
                trendValue="0.3 points"
                color="green"
              />
              <StatCard 
                title="Active Queues" 
                value={analyticsData.overview?.activeQueues || 4}
                icon={Activity}
                trendValue="Stable"
                color="purple"
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Service Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: 'Consultation', value: 40, color: 'bg-blue-500' },
                      { label: 'Registration', value: 30, color: 'bg-green-500' },
                      { label: 'Payment', value: 20, color: 'bg-amber-500' },
                      { label: 'Other', value: 10, color: 'bg-purple-500' }
                    ].map((item) => (
                      <div key={item.label} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{item.label}</span>
                          <span className="font-medium">{item.value}%</span>
                        </div>
                        <Progress value={item.value} className={cn("h-2", item.color)} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Hourly Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between h-[200px] gap-2">
                    {[10, 25, 45, 67, 58, 42, 35, 28].map((value, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-primary/20 rounded-t relative group"
                          style={{ height: `${value * 2}px` }}
                        >
                          <div 
                            className="absolute bottom-0 w-full bg-primary rounded-t transition-all"
                            style={{ height: `${value * 2}px` }}
                          />
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            {value}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{index + 9}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Realtime Tab */}
          <TabsContent value="realtime" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-muted-foreground">Live updates every 30 seconds</span>
              </div>
              <Button variant="outline" size="sm" onClick={loadRealtimeData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Active Queues" value="4" icon={Activity} color="blue" />
              <StatCard title="Waiting Customers" value="23" icon={Users} color="amber" />
              <StatCard title="Served Today" value="156" icon={Zap} color="green" />
              <StatCard title="Staff Online" value="8" icon={Users} color="purple" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Queue Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Queue</TableHead>
                      <TableHead>Waiting</TableHead>
                      <TableHead>Avg Wait</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Staff</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: 'Registration', waiting: 5, avgWait: 8, status: 'active', staff: 2 },
                      { name: 'Consultation', waiting: 12, avgWait: 15, status: 'busy', staff: 3 },
                      { name: 'Billing', waiting: 3, avgWait: 5, status: 'active', staff: 2 },
                      { name: 'Pharmacy', waiting: 8, avgWait: 10, status: 'active', staff: 1 }
                    ].map((queue) => (
                      <TableRow key={queue.name}>
                        <TableCell className="font-medium">{queue.name}</TableCell>
                        <TableCell>{queue.waiting}</TableCell>
                        <TableCell>{queue.avgWait} min</TableCell>
                        <TableCell>
                          <Badge variant={queue.status === 'busy' ? 'destructive' : 'default'}>
                            {queue.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{queue.staff}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Staff Performance Rankings</CardTitle>
                <CardDescription>Based on service speed and customer feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { rank: 1, name: 'Sarah Johnson', score: 94.2, served: 45 },
                    { rank: 2, name: 'Mike Chen', score: 89.7, served: 42 },
                    { rank: 3, name: 'Lisa Rodriguez', score: 87.3, served: 38 }
                  ].map((staff) => (
                    <div key={staff.rank} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                        staff.rank === 1 ? "bg-amber-100 text-amber-700" :
                        staff.rank === 2 ? "bg-slate-100 text-slate-700" :
                        "bg-orange-100 text-orange-700"
                      )}>
                        {staff.rank}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{staff.name}</p>
                        <p className="text-sm text-muted-foreground">{staff.served} customers served</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">{staff.score}%</p>
                        <p className="text-xs text-muted-foreground">Performance score</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customer Tab */}
          <TabsContent value="customer" className="space-y-6 mt-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Satisfaction</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">4.3</div>
                  <p className="text-muted-foreground">out of 5.0</p>
                  <div className="flex justify-center gap-1 mt-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Smile 
                        key={star} 
                        className={cn(
                          "w-8 h-8",
                          star <= 4 ? "text-amber-400 fill-amber-400" : "text-muted-foreground"
                        )} 
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Repeat Customers</span>
                    <span className="font-bold">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">First-time Visitors</span>
                    <span className="font-bold">32%</span>
                  </div>
                  <Progress value={32} className="h-2" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Historical & Operational tabs with similar structure */}
          <TabsContent value="historical" className="space-y-6 mt-6">
            <Card>
              <CardContent className="pt-6 text-center py-20">
                <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Historical Performance Analysis</h3>
                <p className="text-muted-foreground">Charts and detailed trends will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operational" className="space-y-6 mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Resource Utilization</p>
                  <p className="text-4xl font-bold text-primary">87%</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Cost Per Service</p>
                  <p className="text-4xl font-bold text-primary">$12.50</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Efficiency Score</p>
                  <p className="text-4xl font-bold text-primary">92%</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
