import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn, formatTime, formatDate } from '@/lib/utils';
import { 
  Clock, 
  MapPin, 
  X, 
  Users, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Bell
} from 'lucide-react';

const TokenCard = ({ token, onCancel, showActions = true, className }) => {
  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        variant: 'pending',
        icon: Clock,
        label: 'Waiting',
        color: 'text-amber-600 dark:text-amber-400'
      },
      CALLED: {
        variant: 'called',
        icon: Bell,
        label: 'Called - Your Turn!',
        color: 'text-red-600 dark:text-red-400'
      },
      SERVING: {
        variant: 'info',
        icon: AlertCircle,
        label: 'Being Served',
        color: 'text-blue-600 dark:text-blue-400'
      },
      SERVED: {
        variant: 'served',
        icon: CheckCircle,
        label: 'Completed',
        color: 'text-green-600 dark:text-green-400'
      },
      CANCELLED: {
        variant: 'cancelled',
        icon: XCircle,
        label: 'Cancelled',
        color: 'text-gray-500'
      },
      SKIPPED: {
        variant: 'cancelled',
        icon: XCircle,
        label: 'Skipped',
        color: 'text-gray-500'
      }
    };
    return configs[status] || configs.PENDING;
  };

  const statusConfig = getStatusConfig(token.status);
  const StatusIcon = statusConfig.icon;
  const isCalled = token.status === 'CALLED';
  const isActive = ['PENDING', 'CALLED'].includes(token.status);

  // Calculate position progress (inverse: closer to front = higher progress)
  const position = token.position || 0;
  const totalAhead = token.peopleAhead ?? position;
  const progressValue = totalAhead > 0 ? Math.max(0, 100 - (totalAhead * 10)) : 100;

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300",
        isCalled && "ring-2 ring-red-500 animate-pulse-soft shadow-lg shadow-red-500/20",
        className
      )}
    >
      <CardContent className="p-0">
        {/* Status Header */}
        <div className={cn(
          "px-4 py-3 flex items-center justify-between",
          isCalled ? "bg-red-500 text-white" : "bg-muted"
        )}>
          <div className="flex items-center gap-2">
            <StatusIcon className={cn("h-4 w-4", isCalled ? "text-white" : statusConfig.color)} />
            <span className={cn("text-sm font-medium", isCalled ? "text-white" : statusConfig.color)}>
              {statusConfig.label}
            </span>
          </div>
          <Badge variant={statusConfig.variant} className={isCalled ? "bg-white/20 text-white border-white/30" : ""}>
            {token.status}
          </Badge>
        </div>

        {/* Token Info */}
        <div className="p-4 space-y-4">
          {/* Token Number */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Token Number
            </p>
            <p className={cn(
              "text-4xl font-bold tracking-wider",
              isCalled ? "text-red-600 dark:text-red-400" : "text-foreground"
            )}>
              {token.tokenNumber || token.displayNumber || `#${token.id?.slice(-4)}`}
            </p>
          </div>

          {/* Queue Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{token.queue?.name || token.queueName || 'Queue'}</span>
            </div>
            {token.queue?.organisation?.name || token.organisationName ? (
              <p className="text-xs text-muted-foreground pl-6">
                {token.queue?.organisation?.name || token.organisationName}
              </p>
            ) : null}
          </div>

          {/* Position & Wait Time (only for active tokens) */}
          {isActive && (
            <div className="space-y-3">
              {/* Position Progress */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Position in queue</span>
                  <span className="font-medium">
                    {position === 0 ? 'You\'re next!' : `#${position}`}
                  </span>
                </div>
                <Progress value={progressValue} className="h-2" />
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{totalAhead} ahead</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>~{formatTime(token.estimatedWait || totalAhead * 5)} wait</span>
                </div>
              </div>
            </div>
          )}

          {/* Completed/Cancelled Info */}
          {!isActive && (
            <div className="text-xs text-muted-foreground text-center">
              {token.status === 'SERVED' && token.servedAt && (
                <p>Served at {formatDate(token.servedAt)}</p>
              )}
              {token.status === 'CANCELLED' && token.cancelledAt && (
                <p>Cancelled at {formatDate(token.cancelledAt)}</p>
              )}
            </div>
          )}

          {/* Actions */}
          {showActions && isActive && onCancel && (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onCancel(token.id)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel Token
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenCard;
