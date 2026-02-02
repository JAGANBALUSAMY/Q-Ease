import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Building2,
  Clock,
  Bell,
  Shield,
  Download,
  Database,
  Save,
  AlertCircle,
  CheckCircle,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSettingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [organisation, setOrganisation] = useState({
    name: '',
    code: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    operatingHours: {
      start: '09:00',
      end: '17:00',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },
    notificationSettings: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      tokenReminderMinutes: 15
    },
    securitySettings: {
      requireTwoFactor: false,
      sessionTimeout: 60,
      passwordMinLength: 8,
      passwordRequireSpecialChar: true
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadOrganisationSettings();
  }, []);

  const loadOrganisationSettings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.get('/organisations/my');
      setOrganisation(response.data.data.organisation);
    } catch (err) {
      setError('Failed to load organisation settings');
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setOrganisation(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (field.includes('operatingHours.days.')) {
      const day = field.split('.')[2];
      setOrganisation(prev => ({
        ...prev,
        operatingHours: {
          ...prev.operatingHours,
          days: prev.operatingHours.days.includes(day)
            ? prev.operatingHours.days.filter(d => d !== day)
            : [...prev.operatingHours.days, day]
        }
      }));
    } else {
      setOrganisation(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.put('/organisations/my', organisation);
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings');
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await api.get('/data/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `organisation-data-${new Date().toISOString().split('T')[0]}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to export data');
      console.error('Error exporting data:', err);
    }
  };

  const handleBackup = async () => {
    try {
      await api.post('/backup/create');
      setSuccess('Backup created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create backup');
      console.error('Error creating backup:', err);
    }
  };

  const dayNames = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' }
  ];

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container-wide py-6 space-y-6 px-4">
        {/* Header */}
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold">Organisation Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your organisation profile and preferences</p>
          </div>
        </div>

        {/* Messages */}
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organisation Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Organisation Profile
              </CardTitle>
              <CardDescription>Basic information about your organisation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Organisation Name *</Label>
                  <Input
                    id="name"
                    value={organisation.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter organisation name"
                    required
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Organisation Code</Label>
                  <Input
                    id="code"
                    value={organisation.code}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">Auto-generated, cannot be changed</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={organisation.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter organisation description"
                  rows={3}
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    value={organisation.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter organisation address"
                    className="pl-10"
                    rows={2}
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={organisation.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                      className="pl-10"
                      disabled={saving}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={organisation.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter email address"
                      className="pl-10"
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Operating Hours
              </CardTitle>
              <CardDescription>Set when your organisation is open for service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="operatingHours.start">Opening Time</Label>
                  <Input
                    id="operatingHours.start"
                    type="time"
                    value={organisation.operatingHours?.start || '09:00'}
                    onChange={(e) => handleInputChange('operatingHours.start', e.target.value)}
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operatingHours.end">Closing Time</Label>
                  <Input
                    id="operatingHours.end"
                    type="time"
                    value={organisation.operatingHours?.end || '17:00'}
                    onChange={(e) => handleInputChange('operatingHours.end', e.target.value)}
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Operating Days</Label>
                <div className="flex flex-wrap gap-2">
                  {dayNames.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleInputChange(`operatingHours.days.${key}`, null)}
                      disabled={saving}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        organisation.operatingHours?.days?.includes(key)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure how notifications are sent to customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send token updates via email</p>
                  </div>
                  <Switch
                    checked={organisation.notificationSettings?.emailNotifications}
                    onCheckedChange={(checked) => handleInputChange('notificationSettings.emailNotifications', checked)}
                    disabled={saving}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send token updates via SMS</p>
                  </div>
                  <Switch
                    checked={organisation.notificationSettings?.smsNotifications}
                    onCheckedChange={(checked) => handleInputChange('notificationSettings.smsNotifications', checked)}
                    disabled={saving}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send push notifications to mobile devices</p>
                  </div>
                  <Switch
                    checked={organisation.notificationSettings?.pushNotifications}
                    onCheckedChange={(checked) => handleInputChange('notificationSettings.pushNotifications', checked)}
                    disabled={saving}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="tokenReminderMinutes">Token Reminder (minutes before)</Label>
                <Input
                  id="tokenReminderMinutes"
                  type="number"
                  value={organisation.notificationSettings?.tokenReminderMinutes || 15}
                  onChange={(e) => handleInputChange('notificationSettings.tokenReminderMinutes', parseInt(e.target.value))}
                  min="1"
                  max="60"
                  className="max-w-[200px]"
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground">Send reminder notification this many minutes before estimated service time</p>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security options for your organisation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for all staff members</p>
                </div>
                <Switch
                  checked={organisation.securitySettings?.requireTwoFactor}
                  onCheckedChange={(checked) => handleInputChange('securitySettings.requireTwoFactor', checked)}
                  disabled={saving}
                />
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={organisation.securitySettings?.sessionTimeout || 60}
                    onChange={(e) => handleInputChange('securitySettings.sessionTimeout', parseInt(e.target.value))}
                    min="1"
                    max="480"
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={organisation.securitySettings?.passwordMinLength || 8}
                    onChange={(e) => handleInputChange('securitySettings.passwordMinLength', parseInt(e.target.value))}
                    min="6"
                    max="20"
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Special Characters in Passwords</Label>
                  <p className="text-sm text-muted-foreground">Passwords must contain special characters</p>
                </div>
                <Switch
                  checked={organisation.securitySettings?.passwordRequireSpecialChar}
                  onCheckedChange={(checked) => handleInputChange('securitySettings.passwordRequireSpecialChar', checked)}
                  disabled={saving}
                />
              </div>
            </CardContent>
          </Card>

          {/* Backup & Export */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Backup & Export
              </CardTitle>
              <CardDescription>Manage your organisation data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleBackup}
                  disabled={saving}
                  className="flex-1"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Create Backup
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleExportData}
                  disabled={saving}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={saving}
              size="lg"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
