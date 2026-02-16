"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ReactNode } from "react";

export function ResponsiveModal({ 
  title, 
  description,
  trigger, 
  children, 
  open, 
  onOpenChange 
}: {
  title: string;
  description?: string;
  trigger?: ReactNode;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
             {description && <p className="text-sm text-gray-500">{description}</p>}
          </DialogHeader>
          <div className="max-h-[80vh] overflow-y-auto">
             {children}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </DrawerHeader>
        <div className="px-4 pb-4 max-h-[80vh] overflow-y-auto">
           {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
