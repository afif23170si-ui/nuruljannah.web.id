"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { getGroupedNavigation } from "@/components/admin/navigation-data";

interface MobileSidebarProps {
  logoUrl?: string | null;
}

export function MobileSidebar({ logoUrl }: MobileSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const userRole = session?.user?.role || "JAMAAH";

  const groups = getGroupedNavigation(userRole);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden text-gray-500 hover:text-gray-900 -ml-3">
           <Menu className="h-6 w-6" />
           <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[260px] p-0 flex flex-col">
        <div className="p-5 pb-4 border-b border-gray-100 flex items-center gap-3">
           <div className={cn(
             "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg overflow-hidden relative",
             !logoUrl ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30" : "bg-transparent"
           )}>
             {logoUrl ? (
               <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
             ) : (
               <span className="text-lg font-bold">M</span>
             )}
           </div>
           <div>
             <SheetTitle className="text-[16px] font-bold text-gray-900 leading-tight">Nurul Jannah</SheetTitle>
             <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Admin Panel</p>
           </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 px-4 custom-scrollbar">
          <div className="space-y-3">
            {groups.map((group, gi) => (
              <div key={group.label || "core"}>
                {/* Group label */}
                {group.label && (
                  <div className="mb-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                      {group.label}
                    </span>
                  </div>
                )}
                {/* Items */}
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/admin" && pathname.startsWith(item.href));

                    if (item.disabled) {
                      return (
                        <div
                          key={item.name}
                          className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-semibold text-gray-300 cursor-not-allowed"
                        >
                          <item.icon className="h-[18px] w-[18px] shrink-0 text-gray-300" />
                          <span className="flex-1">{item.name}</span>
                          {item.badge && (
                            <span className="text-[9px] font-bold bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-2.5 py-2 text-[13px] font-semibold transition-all duration-200",
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                        )}
                      >
                        <item.icon className={cn(
                          "h-[18px] w-[18px] shrink-0 transition-colors",
                          isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-600"
                        )} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        <div className="p-3 border-t border-gray-100">
           <Button 
             variant="ghost" 
             className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 gap-2.5 px-3 h-9 text-[13px]"
             onClick={() => signOut({ callbackUrl: "/" })}
           >
              <LogOut className="h-[18px] w-[18px]" />
              Sign Out
           </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
