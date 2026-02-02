import React from 'react';
import { cn } from '@/lib/utils';

const StatusBadge = ({ status, size = 'default', showDot = true, className }) => {
  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        label: 'Pending',
        bgColor: 'bg-amber-100 dark:bg-amber-900/30',
        textColor: 'text-amber-700 dark:text-amber-400',
        dotColor: 'bg-amber-500'
      },
      CALLED: {
        label: 'Called',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        textColor: 'text-red-700 dark:text-red-400',
        dotColor: 'bg-red-500 animate-pulse'
      },
      SERVING: {
        label: 'Serving',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        textColor: 'text-blue-700 dark:text-blue-400',
        dotColor: 'bg-blue-500'
      },
      SERVED: {
        label: 'Served',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        textColor: 'text-green-700 dark:text-green-400',
        dotColor: 'bg-green-500'
      },
      CANCELLED: {
        label: 'Cancelled',
        bgColor: 'bg-gray-100 dark:bg-gray-800',
        textColor: 'text-gray-700 dark:text-gray-400',
        dotColor: 'bg-gray-500'
      },
      SKIPPED: {
        label: 'Skipped',
        bgColor: 'bg-gray-100 dark:bg-gray-800',
        textColor: 'text-gray-700 dark:text-gray-400',
        dotColor: 'bg-gray-500'
      },
      ACTIVE: {
        label: 'Active',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        textColor: 'text-green-700 dark:text-green-400',
        dotColor: 'bg-green-500'
      },
      PAUSED: {
        label: 'Paused',
        bgColor: 'bg-amber-100 dark:bg-amber-900/30',
        textColor: 'text-amber-700 dark:text-amber-400',
        dotColor: 'bg-amber-500'
      },
      INACTIVE: {
        label: 'Inactive',
        bgColor: 'bg-gray-100 dark:bg-gray-800',
        textColor: 'text-gray-700 dark:text-gray-400',
        dotColor: 'bg-gray-500'
      }
    };
    return configs[status] || configs.PENDING;
  };

  const config = getStatusConfig(status);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    default: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        config.bgColor,
        config.textColor,
        sizeClasses[size],
        className
      )}
    >
      {showDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full", config.dotColor)} />
      )}
      {config.label}
    </span>
  );
};

export default StatusBadge;
