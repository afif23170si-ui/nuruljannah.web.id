"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FullScreenMobileFormProps {
  children: ReactNode;
  className?: string;
  mobileActionHeader?: ReactNode; // Actions to show in sticky header on mobile
}

export function FullScreenMobileForm({ 
  children, 
  className,
  mobileActionHeader
}: FullScreenMobileFormProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)"); // lg breakpoint

  if (isDesktop) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={cn("flex flex-col min-h-[calc(100vh-4rem)]", className)}>
       {mobileActionHeader && (
         <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 -mx-4 -mt-4 mb-4 flex items-center justify-between">
            {mobileActionHeader}
         </div>
       )}
       {children}
    </div>
  );
}


// Correction:
// The "Article Form" is a unified form.
// On desktop, it has side-by-side layout.
// On mobile, it stacks.
// The "FullScreenMobileForm" might be intended to CREATE a modal experience for things that ARE modals 
// (like Announcement Edit), converting them to Drawers on mobile.

// Usage for Announcement (Modal):
// Desktop: Dialog
// Mobile: Drawer


