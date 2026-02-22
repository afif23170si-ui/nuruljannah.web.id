"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { navigation } from "@/components/admin/navigation-data";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { data: session } = useSession();
  const userRole = session?.user?.role || "JAMAAH";

  // Filter navigation by role
  const availableItems = useMemo(
    () => navigation.filter((item) => item.roles.includes(userRole) && !item.disabled),
    [userRole]
  );

  // Filter by search query
  const filtered = useMemo(() => {
    if (!query.trim()) return availableItems;
    const q = query.toLowerCase();
    return availableItems.filter((item) =>
      item.name.toLowerCase().includes(q) || item.href.toLowerCase().includes(q)
    );
  }, [query, availableItems]);

  // Reset selection when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filtered]);

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery("");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Navigate on select
  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  // Arrow keys + Enter inside dialog
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex].href);
      }
    }
  };

  return (
    <>
      {/* Trigger button — same style on mobile and desktop */}
      <button
        onClick={() => { setOpen(true); setQuery(""); }}
        className="flex items-center gap-2 text-gray-400 bg-gray-50 hover:bg-gray-100 px-2.5 md:px-3 py-1.5 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="text-xs md:text-sm">Search...</span>
        <kbd className="hidden sm:inline ml-2 md:ml-4 text-[10px] font-mono bg-white border border-gray-200 rounded px-1.5 py-0.5 text-gray-400">⌘K</kbd>
      </button>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-xl">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <Search className="h-4 w-4 text-gray-400 shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Cari halaman admin..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
              className="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-400"
            />
            <kbd className="text-[10px] font-mono bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 text-gray-400">ESC</kbd>
          </div>

          {/* Results */}
          <div className="max-h-[300px] overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-400">Tidak ditemukan halaman &quot;{query}&quot;</p>
              </div>
            ) : (
              filtered.map((item, i) => (
                <button
                  key={item.href}
                  onClick={() => handleSelect(item.href)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                    i === selectedIndex ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <item.icon className={cn(
                    "h-4 w-4 shrink-0",
                    i === selectedIndex ? "text-blue-600" : "text-gray-400"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{item.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{item.href}</p>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer hints */}
          <div className="px-4 py-2 border-t border-gray-100 flex items-center gap-4 text-[10px] text-gray-400">
            <span className="flex items-center gap-1"><kbd className="bg-gray-100 border border-gray-200 rounded px-1 py-0.5 font-mono">↑↓</kbd> navigasi</span>
            <span className="flex items-center gap-1"><kbd className="bg-gray-100 border border-gray-200 rounded px-1 py-0.5 font-mono">↵</kbd> pilih</span>
            <span className="flex items-center gap-1"><kbd className="bg-gray-100 border border-gray-200 rounded px-1 py-0.5 font-mono">esc</kbd> tutup</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
