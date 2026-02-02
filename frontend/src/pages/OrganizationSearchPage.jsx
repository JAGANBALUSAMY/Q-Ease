import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchInput, EmptyState, QueueCardSkeleton } from '@/components/common';
import { 
  Search,
  MapPin,
  Clock,
  Building2,
  CheckCircle2,
  ArrowRight,
  Users,
  Grid3X3,
  List,
  Filter,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const OrganizationSearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [organizations, setOrganizations] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const response = await api.get('/organisations');
      setOrganizations(response.data.data.organisations || []);
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError('Failed to load organizations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) {
      fetchOrganizations();
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/organisations/search?q=${encodeURIComponent(searchQuery)}`);
      setOrganizations(response.data.data.organisations || []);
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrgs = searchQuery
    ? organizations.filter(org =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.address?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : organizations;

  // Organization Card Component
  const OrgCard = ({ org, isListView }) => (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50",
        isListView && "flex-row"
      )}
      onClick={() => navigate(`/org/${org.code || org.id}`)}
    >
      <CardContent className={cn(
        "p-5",
        isListView && "flex items-center gap-6 w-full"
      )}>
        {/* Header */}
        <div className={cn(
          "flex items-start gap-4",
          isListView ? "flex-1" : "mb-4"
        )}>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-primary">
              {org.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {org.name}
              </h3>
              {org.isVerified && (
                <Badge variant="secondary" className="shrink-0 gap-1 text-green-600 bg-green-50 dark:bg-green-900/20">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>
            {org.code && (
              <p className="text-sm text-muted-foreground">Code: {org.code}</p>
            )}
          </div>
        </div>

        {/* Details */}
        <div className={cn(
          "space-y-2",
          isListView ? "flex-1" : "mb-4"
        )}>
          {org.address && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{org.address}</span>
            </div>
          )}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{org._count?.queues || 0} Queues</span>
            </div>
            {org._count?.activeTokens > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{org._count.activeTokens} in queue</span>
              </div>
            )}
          </div>
        </div>

        {/* Action */}
        <Button 
          className={cn(
            "gap-2",
            isListView ? "shrink-0" : "w-full"
          )}
          variant={isListView ? "outline" : "default"}
        >
          View Queues
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-[80vh] bg-background">
      <div className="container-wide py-6 sm:py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Find Organizations
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Browse and search for organizations with active queues
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by name, location, or code..."
                onClear={() => {
                  setSearchQuery('');
                  fetchOrganizations();
                }}
              />
            </div>
            <Button type="submit" className="shrink-0">
              <Search className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Search</span>
            </Button>
          </form>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            {!loading && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{filteredOrgs.length}</span> organizations found
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchOrganizations(true)}
              disabled={refreshing}
            >
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            </Button>
            <div className="flex items-center border rounded-lg p-1 bg-muted/30">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 px-3"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 px-3"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className={cn(
            "gap-4",
            viewMode === 'grid' 
              ? "grid sm:grid-cols-2 lg:grid-cols-3" 
              : "flex flex-col"
          )}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <QueueCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-destructive/10 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{error}</h3>
            <p className="text-muted-foreground mb-4">
              Something went wrong while loading organizations
            </p>
            <Button onClick={() => fetchOrganizations()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : filteredOrgs.length > 0 ? (
          <div className={cn(
            "gap-4",
            viewMode === 'grid' 
              ? "grid sm:grid-cols-2 lg:grid-cols-3" 
              : "flex flex-col"
          )}>
            {filteredOrgs.map(org => (
              <OrgCard 
                key={org.id} 
                org={org} 
                isListView={viewMode === 'list'} 
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Building2}
            title="No Organizations Found"
            description={
              searchQuery 
                ? "Try adjusting your search or browse all organizations"
                : "There are no organizations available at the moment"
            }
            action={
              searchQuery && (
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    fetchOrganizations();
                  }}
                >
                  Clear Search
                </Button>
              )
            }
          />
        )}
      </div>
    </div>
  );
};

export default OrganizationSearchPage;
