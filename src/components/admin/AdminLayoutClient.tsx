"use client";

import { useState } from "react";
import { AdminSidebar, AdminHeader } from "@/components/admin/Sidebar";
import { cn } from "@/lib/utils";

export default function AdminLayoutClient({
  children,
  logoUrl,
}: {
  children: React.ReactNode;
  logoUrl?: string | null;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Metronic Logic:
  // Layout padding depends ONLY on whether sidebar is collapsed or expanded (toggled).
  // Hover expansion is an overlay and does not affect this padding.

  return (
    <div className="min-h-screen bg-white flex flex-col">
       {/* Sidebar */}
       <AdminSidebar 
          collapsed={sidebarCollapsed} 
          setCollapsed={setSidebarCollapsed}
          logoUrl={logoUrl}
       />
       
       {/* Main Content Wrapper */}
       <div 
         className={cn(
           "flex flex-col flex-1 transition-all duration-300 ease-in-out min-h-screen",
           sidebarCollapsed ? "lg:pl-[80px]" : "lg:pl-[280px]" 
         )}
       >
          <AdminHeader collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
          
          <main className="flex-1 p-8 md:p-10 max-w-[1600px] mx-auto w-full">
            {children}
          </main>
       </div>
    </div>
  );
}
