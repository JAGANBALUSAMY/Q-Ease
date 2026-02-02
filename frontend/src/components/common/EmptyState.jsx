import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Inbox, 
  Search, 
  FileQuestion, 
  Users, 
  Calendar,
  Bell,
  Ticket,
  Building2
} from 'lucide-react';

const EmptyState = ({ 
  icon: CustomIcon,
  title, 
  description, 
  action,
  actionLabel,
  variant = 'default', // 'default', 'search', 'tokens', 'notifications', 'queues'
  className 
}) => {
  const getDefaultContent = () => {
    const variants = {
      default: {
        icon: Inbox,
        title: 'No data found',
        description: 'There\'s nothing here yet.'
      },
      search: {
        icon: Search,
        title: 'No results found',
        description: 'Try adjusting your search or filter to find what you\'re looking for.'
      },
      tokens: {
        icon: Ticket,
        title: 'No tokens yet',
        description: 'Join a queue to get your first token and start tracking your position.'
      },
      notifications: {
        icon: Bell,
        title: 'No notifications',
        description: 'You\'re all caught up! Notifications will appear here.'
      },
      queues: {
        icon: Building2,
        title: 'No queues available',
        description: 'There are no active queues at the moment. Check back later.'
      },
      users: {
        icon: Users,
        title: 'No users found',
        description: 'No users match your current filters.'
      }
    };
    return variants[variant] || variants.default;
  };

  const defaults = getDefaultContent();
  const Icon = CustomIcon || defaults.icon;

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className
    )}>
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">
        {title || defaults.title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {description || defaults.description}
      </p>
      {action && actionLabel && (
        <Button onClick={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
