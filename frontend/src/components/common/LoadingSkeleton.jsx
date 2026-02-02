import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Token Card Skeleton
export const TokenCardSkeleton = () => (
  <Card>
    <CardContent className="p-0">
      <div className="px-4 py-3 bg-muted">
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="p-4 space-y-4">
        <div className="text-center space-y-2">
          <Skeleton className="h-3 w-20 mx-auto" />
          <Skeleton className="h-10 w-32 mx-auto" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
        <Skeleton className="h-2 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Queue Card Skeleton
export const QueueCardSkeleton = () => (
  <Card>
    <CardContent className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-4 w-full mb-4" />
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-1">
            <Skeleton className="h-6 w-8" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-1">
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </div>
    </CardContent>
    <div className="p-4 pt-0">
      <Skeleton className="h-10 w-full" />
    </div>
  </Card>
);

// Stats Card Skeleton
export const StatsCardSkeleton = () => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-12 w-12 rounded-lg" />
      </div>
    </CardContent>
  </Card>
);

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 5 }) => (
  <div className="flex items-center gap-4 py-4 border-b">
    {Array.from({ length: columns }).map((_, i) => (
      <Skeleton key={i} className="h-4 flex-1" />
    ))}
  </div>
);

// Page Header Skeleton
export const PageHeaderSkeleton = () => (
  <div className="space-y-2 mb-6">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-4 w-64" />
  </div>
);

// Dashboard Skeleton
export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <PageHeaderSkeleton />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <TableRowSkeleton key={i} columns={3} />
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <TableRowSkeleton key={i} columns={3} />
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

// List Skeleton
export const ListSkeleton = ({ count = 5, variant = 'default' }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      variant === 'card' ? (
        <QueueCardSkeleton key={i} />
      ) : (
        <TableRowSkeleton key={i} />
      )
    ))}
  </div>
);
