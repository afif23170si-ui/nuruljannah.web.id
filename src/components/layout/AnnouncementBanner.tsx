"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, X, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AnnouncementType = "INFO" | "WARNING" | "URGENT";

interface Announcement {
  id: string;
  message: string;
  type: AnnouncementType;
}

interface AnnouncementBannerProps {
  announcements: Announcement[];
}

const typeConfig: Record<
  AnnouncementType,
  { bg: string; text: string; icon: typeof Info; dot: string }
> = {
  INFO: {
    bg: "bg-emerald-600",
    text: "text-white",
    icon: Info,
    dot: "bg-emerald-300/50",
  },
  WARNING: {
    bg: "bg-amber-500",
    text: "text-amber-950",
    icon: AlertTriangle,
    dot: "bg-amber-700/30",
  },
  URGENT: {
    bg: "bg-red-600",
    text: "text-white",
    icon: AlertCircle,
    dot: "bg-red-300/50",
  },
};

export function AnnouncementBanner({ announcements }: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  // Determine banner style based on highest priority type
  const hasUrgent = announcements.some((a) => a.type === "URGENT");
  const hasWarning = announcements.some((a) => a.type === "WARNING");
  const bannerType: AnnouncementType = hasUrgent
    ? "URGENT"
    : hasWarning
    ? "WARNING"
    : "INFO";
  const config = typeConfig[bannerType];
  const Icon = config.icon;

  // Build the message text (single copy, centered start)
  const marqueeText = announcements.map((a) => a.message).join("   •   ");

  useEffect(() => {
    if (announcements.length > 0 && !dismissed) {
      document.body.classList.add("has-announcement");
    } else {
      document.body.classList.remove("has-announcement");
    }
    return () => document.body.classList.remove("has-announcement");
  }, [announcements.length, dismissed]);

  return (
    <AnimatePresence>
      {!dismissed && announcements && announcements.length > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "relative overflow-hidden z-40",
            config.bg,
            config.text
          )}
        >
          <div className="flex items-center h-9">
            {/* Left icon badge */}
            <div className="flex-shrink-0 flex items-center justify-center px-3 h-full bg-black/10">
              <Megaphone className="h-3.5 w-3.5" />
            </div>

            {/* Marquee container */}
            <div className="flex-1 overflow-hidden relative flex items-center justify-center">
              {/* Fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-current/10 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-current/10 to-transparent z-10 pointer-events-none" />

              <div className="animate-marquee-continuous whitespace-nowrap text-sm font-medium inline-block">
                {marqueeText}
              </div>
            </div>

            {/* Dismiss button */}
            <button
              onClick={() => setDismissed(true)}
              className="flex-shrink-0 flex items-center justify-center px-3 h-full hover:bg-black/10 transition-colors"
              aria-label="Tutup pengumuman"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
