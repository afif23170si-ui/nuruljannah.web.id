// Prevent static generation - render on demand only
export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { getEventList, deleteEvent } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import Link from "next/link";
import { DeleteEventButton } from "./DeleteEventButton";

export const metadata: Metadata = {
  title: "Kelola Agenda Masjid",
  description: "Kelola agenda dan kegiatan masjid",
};

const DAYS = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const CATEGORY_CONFIG: Record<
  string,
  { label: string; color: string; icon: typeof BookOpen }
> = {
  KAJIAN_RUTIN: {
    label: "Kajian Rutin",
    color: "bg-emerald-500/10 text-emerald-700",
    icon: BookOpen,
  },
  PROGRAM_RUTIN: {
    label: "Program Rutin",
    color: "bg-blue-500/10 text-blue-700",
    icon: RefreshCw,
  },
  EVENT_BESAR: {
    label: "Event Besar",
    color: "bg-amber-500/10 text-amber-700",
    icon: Star,
  },
  SOSIAL: {
    label: "Sosial",
    color: "bg-rose-500/10 text-rose-700",
    icon: Heart,
  },
  INTERNAL_DKM: {
    label: "Internal DKM",
    color: "bg-indigo-500/10 text-indigo-700",
    icon: Shield,
  },
};

export default async function AgendaAdminPage() {
  const eventList = await getEventList();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agenda Masjid</h1>
          <p className="text-muted-foreground">
            Kelola semua agenda dan kegiatan masjid
          </p>
        </div>
        <Link href="/admin/kajian/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Agenda
          </Button>
        </Link>
      </div>

      {/* Event Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Agenda ({eventList.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {eventList.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p className="mb-2">Belum ada agenda.</p>
              <Link href="/admin/kajian/new">
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Buat Agenda Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Jadwal</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px] text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventList.map((event) => {
                  const catConfig = CATEGORY_CONFIG[event.category];
                  const CatIcon = catConfig?.icon || CalendarDays;
                  return (
                    <TableRow key={event.id}>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={catConfig?.color || ""}
                        >
                          <CatIcon className="h-3 w-3 mr-1" />
                          {catConfig?.label || event.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>
                          {event.title}
                          {event.speaker && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {event.speaker}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {event.isRecurring ? (
                          <Badge variant="outline" className="gap-1">
                            <Repeat className="h-3 w-3" />
                            {event.dayOfWeek !== null &&
                            event.dayOfWeek !== undefined
                              ? DAYS[event.dayOfWeek]
                              : "-"}
                          </Badge>
                        ) : event.date ? (
                          <span className="text-sm">
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
                      <TableCell>
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="h-3 w-3" />
                          {event.time}
                          {event.endTime ? ` - ${event.endTime}` : ""}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {event.location || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={event.isActive ? "default" : "outline"}
                        >
                          {event.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/kajian/${event.id}`}>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </Link>
                          <DeleteEventButton
                            eventId={event.id}
                            eventTitle={event.title}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
