import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatsCard = ({ 
  title, 
  value, 
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  variant = 'default', // 'default', 'primary', 'success', 'warning', 'info'
  className 
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend === 'up') return <TrendingUp className="h-3 w-3" />;
    if (trend === 'down') return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600 dark:text-green-400';
    if (trend === 'down') return 'text-red-600 dark:text-red-400';
    return 'text-muted-foreground';
  };

  const getIconBgColor = () => {
    const colors = {
      default: 'bg-muted',
      primary: 'bg-primary/10 text-primary',
      success: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
      info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    };
    return colors[variant] || colors.default;
  };

  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              {trend && trendValue && (
                <span className={cn("flex items-center gap-0.5 text-xs font-medium", getTrendColor())}>
                  {getTrendIcon()}
                  {trendValue}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {Icon && (
            <div className={cn("p-3 rounded-lg", getIconBgColor())}>
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
