import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  ListOrdered,
  Users,
  BarChart3,
  Settings,
  Building2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const menuItems = [
    {
      title: 'Overview',
      items: [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'Management',
      items: [
        { path: '/admin/queues', label: 'Queues', icon: ListOrdered },
        { path: '/admin/users', label: 'Users & Staff', icon: Users },
      ]
    },
    {
      title: 'Insights',
      items: [
        { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'Settings',
      items: [
        { path: '/admin/settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  // Add super admin items
  if (user?.role === 'SUPER_ADMIN') {
    menuItems.splice(2, 0, {
      title: 'Super Admin',
      items: [
        { path: '/admin/organisations', label: 'Organizations', icon: Building2 },
        { path: '/admin/admins', label: 'Manage Admins', icon: ShieldCheck },
      ]
    });
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r transition-all duration-300 z-40",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Collapse Toggle */}
        <div className="flex justify-end p-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          {menuItems.map((section, idx) => (
            <div key={section.title} className="mb-4">
              {!collapsed && (
                <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                        collapsed && "justify-center px-2"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
              {idx < menuItems.length - 1 && !collapsed && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t">
            <div className="text-xs text-muted-foreground">
              <p className="font-medium">{user?.organisation?.name || 'Q-Ease'}</p>
              <p>{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
