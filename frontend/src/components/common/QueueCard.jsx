import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Users, 
  Clock, 
  MapPin, 
  Play, 
  Pause,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

const QueueCard = ({ 
  queue, 
  onJoin, 
  onToggle,
  showActions = true,
  variant = 'default', // 'default', 'compact', 'admin'
  className 
}) => {
  const navigate = useNavigate();
  
  const waitingCount = queue._count?.tokens || queue.waitingCount || 0;
  const avgWaitTime = queue.averageTime || queue.avgWaitTime || 10;
  const isActive = queue.isActive !== false;
  const isPaused = queue.isPaused || !isActive;

  const handleJoinClick = () => {
    if (onJoin) {
      onJoin(queue.id);
    } else {
      navigate(`/queue/${queue.id}`);
    }
  };

  if (variant === 'compact') {
    return (
      <Card className={cn("hover:shadow-md transition-shadow cursor-pointer", className)} onClick={handleJoinClick}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{queue.name}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {queue.organisation?.name || queue.organisationName}
              </p>
            </div>
            <div className="flex items-center gap-3 ml-4">
              <Badge variant={waitingCount > 10 ? 'warning' : 'secondary'}>
                {waitingCount} waiting
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-lg",
      isPaused && "opacity-75",
      className
    )}>
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate">{queue.name}</h3>
              {isPaused && (
                <Badge variant="warning" className="text-xs">
                  <Pause className="h-3 w-3 mr-1" />
                  Paused
                </Badge>
              )}
            </div>
            {(queue.organisation?.name || queue.organisationName) && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{queue.organisation?.name || queue.organisationName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {queue.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {queue.description}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{waitingCount}</p>
              <p className="text-xs text-muted-foreground">Waiting</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-secondary">
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">~{avgWaitTime}m</p>
              <p className="text-xs text-muted-foreground">Est. wait</p>
            </div>
          </div>
        </div>

        {/* Current Token (for admin view) */}
        {variant === 'admin' && queue.currentToken && (
          <div className="mt-4 p-3 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground mb-1">Now Serving</p>
            <p className="text-xl font-bold">{queue.currentToken}</p>
          </div>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className="p-4 pt-0 gap-2">
          {variant === 'admin' ? (
            <>
              <Button
                variant={isPaused ? "default" : "secondary"}
                size="sm"
                className="flex-1"
                onClick={() => onToggle?.(queue.id, isActive)}
              >
                {isPaused ? (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </>
                )}
              </Button>
              <Button
                size="sm"
                className="flex-1"
                onClick={() => navigate(`/admin/queues/${queue.id}`)}
              >
                Manage
              </Button>
            </>
          ) : (
            <Button 
              className="w-full" 
              onClick={handleJoinClick}
              disabled={isPaused}
            >
              {isPaused ? 'Queue Paused' : 'Join Queue'}
              {!isPaused && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default QueueCard;
