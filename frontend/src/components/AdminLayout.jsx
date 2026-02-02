import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <Navbar />

      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
      />

      {/* Main Content */}
      <main
        className={cn(
          "min-h-[calc(100vh-4rem)] pt-4 pb-8 transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <div className="container-wide">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
