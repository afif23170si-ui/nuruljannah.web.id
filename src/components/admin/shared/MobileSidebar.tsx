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
import { navigation } from "@/components/admin/navigation-data";

interface MobileSidebarProps {
  logoUrl?: string | null;
}

export function MobileSidebar({ logoUrl }: MobileSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const userRole = session?.user?.role || "JAMAAH";

  // Filter navigation based on role
  const filteredNav = navigation.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden text-gray-500 hover:text-gray-900 -ml-3">
           <Menu className="h-6 w-6" />
           <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0 flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
           <div className={cn(
             "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg overflow-hidden relative",
             !logoUrl ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30" : "bg-transparent"
           )}>
             {logoUrl ? (
               <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
             ) : (
               <span className="text-lg font-bold">M</span>
             )}
           </div>
           <div>
             <SheetTitle className="text-lg font-bold text-gray-900 leading-tight">Nurul Jannah</SheetTitle>
             <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Admin Panel</p>
           </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
           <div className="space-y-1">
             {filteredNav.map((item) => {
               const isActive =
                 pathname === item.href ||
                 (item.href !== "/admin" && pathname.startsWith(item.href));

               return (
                 <Link
                   key={item.name}
                   href={item.href}
                   onClick={() => setOpen(false)}
                   className={cn(
                     "flex items-center gap-3 rounded-lg px-3 py-3 text-[13px] font-semibold transition-all duration-200",
                     isActive
                       ? "bg-blue-50 text-blue-600"
                       : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                   )}
                 >
                   <item.icon className={cn(
                     "h-5 w-5 shrink-0 transition-colors",
                     isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-600"
                   )} />
                   <span>{item.name}</span>
                 </Link>
               );
             })}
           </div>
        </nav>

        <div className="p-4 border-t border-gray-100">
           <Button 
             variant="ghost" 
             className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 gap-3 px-3"
             onClick={() => signOut({ callbackUrl: "/" })}
           >
              <LogOut className="h-5 w-5" />
              Sign Out
           </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
