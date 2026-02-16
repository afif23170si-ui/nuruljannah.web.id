// Prevent static generation - render on demand only
export const dynamic = "force-dynamic";

import { Metadata } from "next";
import Link from "next/link";
import { getEventList } from "@/actions/admin";
import { AdminCard } from "@/components/admin/shared/AdminCard";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Clock,
  BookOpen,
  RefreshCw,
  Star,
  Heart,
  Shield,
  CalendarDays,
  Repeat,
  MapPin,
  Edit,
} from "lucide-react";
import { DeleteEventButton } from "./DeleteEventButton";

export const metadata: Metadata = {
  title: "Kelola Agenda - Metronic Admin",
  description: "Kelola agenda dan kegiatan masjid",
};

const DAYS = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const CATEGORY_CONFIG: Record<
  string,
  { label: string; color: string; icon: typeof BookOpen }
> = {
  KAJIAN_RUTIN: {
    label: "Kajian Rutin",
    color: "bg-emerald-50 text-emerald-600 border-none",
    icon: BookOpen,
  },
  PROGRAM_RUTIN: {
    label: "Program Rutin",
    color: "bg-blue-50 text-blue-600 border-none",
    icon: RefreshCw,
  },
  EVENT_BESAR: {
    label: "Event Besar",
    color: "bg-amber-50 text-amber-600 border-none",
    icon: Star,
  },
  SOSIAL: {
    label: "Sosial",
    color: "bg-rose-50 text-rose-600 border-none",
    icon: Heart,
  },
  INTERNAL_DKM: {
    label: "Internal DKM",
    color: "bg-indigo-50 text-indigo-600 border-none",
    icon: Shield,
  },
};

export default async function AgendaAdminPage() {
  const eventList = await getEventList();

  return (
    <div className="animate-fade-in">
      <AdminPageHeader 
        title="Agenda Masjid" 
        description="Jadwal kajian, program rutin, dan event masjid"
        action={
          <Link href="/admin/kajian/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Agenda
            </Button>
          </Link>
        }
      />

      <AdminCard title={`Daftar Agenda (${eventList.length})`}>
          {eventList.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                 <CalendarDays className="h-10 w-10 text-gray-300" />
              </div>
              <p className="text-gray-500 mb-6">Belum ada agenda yang dijadwalkan.</p>
              <Link href="/admin/kajian/new">
                <Button variant="outline" className="border-dashed border-gray-300 hover:border-blue-500 hover:text-blue-600">
                  Buat Agenda Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-gray-100">
                  <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">Kategori</TableHead>
                  <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">Judul & Pembicara</TableHead>
                  <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">Jadwal</TableHead>
                  <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">Waktu</TableHead>
                  <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">Lokasi</TableHead>
                  <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">Status</TableHead>
                  <TableHead className="w-[120px] text-right py-4">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventList.map((event) => {
                  const catConfig = CATEGORY_CONFIG[event.category];
                  const CatIcon = catConfig?.icon || CalendarDays;
                  return (
                    <TableRow key={event.id} className="hover:bg-gray-50 border-b border-gray-50 transition-colors">
                      <TableCell className="py-4">
                        <Badge
                          variant="outline"
                          className={`font-semibold ${catConfig?.color || ""}`}
                        >
                          <CatIcon className="h-3 w-3 mr-1" />
                          {catConfig?.label || event.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 font-medium text-gray-800">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">{event.title}</span>
                          {event.speaker && (
                            <span className="text-xs text-gray-500 font-semibold mt-1 flex items-center">
                               <Users className="h-3 w-3 mr-1" /> {event.speaker}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-sm text-gray-600">
                        {event.isRecurring ? (
                          <div className="flex items-center gap-1 font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md w-fit text-xs">
                            <Repeat className="h-3 w-3" />
                            {event.dayOfWeek !== null && event.dayOfWeek !== undefined
                              ? DAYS[event.dayOfWeek]
                              : "-"}
                          </div>
                        ) : event.date ? (
                          <span className="font-semibold text-gray-700">
                            {new Date(event.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                         <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded-md w-fit">
                            <Clock className="h-3.5 w-3.5 text-gray-400" />
                            {event.time}
                            {event.endTime ? ` - ${event.endTime}` : ""}
                         </div>
                      </TableCell>
                      <TableCell className="py-4 text-sm text-gray-500">
                         {event.location ? (
                            <div className="flex items-center gap-1">
                               <MapPin className="h-3.5 w-3.5 text-gray-400" />
                               <span className="truncate max-w-[150px]">{event.location}</span>
                            </div>
                         ) : "-"}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          className={event.isActive ? "bg-green-50 text-green-700 hover:bg-green-100 border-none" : "bg-gray-100 text-gray-500 border-none"}
                        >
                          {event.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/kajian/${event.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          {/* Note: DeleteEventButton needs to be styled or just passed as is. It usually returns a Button. */}
                          <div className="scale-90">
                             <DeleteEventButton
                               eventId={event.id}
                               eventTitle={event.title}
                             />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
      </AdminCard>
    </div>
  );
}

// Helper icon for map
function Users({ className }: { className?: string }) {
   return (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
   )
}
