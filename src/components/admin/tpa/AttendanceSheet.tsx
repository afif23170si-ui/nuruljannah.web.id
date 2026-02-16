"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AdminCard } from "@/components/admin/shared/AdminCard";
import { toast } from "sonner";
import { Loader2, Save, CalendarIcon } from "lucide-react";
import { submitAttendance } from "@/actions/tpa";

interface AttendanceSheetProps {
  classes: { id: string; name: string }[];
  students: any[];
  attendanceData: any[];
  initialClassId?: string;
  initialDate?: string;
}

export function AttendanceSheet({ 
  classes, 
  students, 
  attendanceData,
  initialClassId,
  initialDate 
}: AttendanceSheetProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedClass, setSelectedClass] = useState(initialClassId || "");
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Local state for attendance to allow instant UI updates
  const [attendanceState, setAttendanceState] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Initialize state from existing data
    const initialState: { [key: string]: string } = {};
    students.forEach(student => {
      const existing = attendanceData.find(a => a.studentId === student.id);
      initialState[student.id] = existing?.status || "PRESENT";
    });
    setAttendanceState(initialState);
  }, [students, attendanceData]);

  const handleFilterChange = (classId: string, date: string) => {
    setLoading(true);
    const params = new URLSearchParams(searchParams);
    if (classId) params.set("classId", classId);
    if (date) params.set("date", date);
    router.push(`/admin/tpa/attendance?${params.toString()}`);
  };

  const handleAttendanceChange = (studentId: string, status: string) => {
    setAttendanceState(prev => ({ ...prev, [studentId]: status }));
  };

  const hasChanges = () => {
    // Simple check: always allow save if students exist
    return students.length > 0;
  };

  const handleSave = async () => {
    if (!selectedClass || !selectedDate) return;
    
    setSaving(true);
    try {
      const promises = students.map(student => {
        return submitAttendance({
          studentId: student.id,
          date: new Date(selectedDate),
          status: (attendanceState[student.id] || "PRESENT") as any,
        });
      });

      await Promise.all(promises);
      toast.success("Absensi berhasil disimpan");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan absensi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtering Controls */}
      <AdminCard className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/3 space-y-2">
            <Label>Pilih Kelas</Label>
            <Select 
              value={selectedClass} 
              onValueChange={(val) => {
                setSelectedClass(val);
                handleFilterChange(val, selectedDate);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kelas" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-1/3 space-y-2">
            <Label>Tanggal</Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="date" 
                className="pl-9"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  handleFilterChange(selectedClass, e.target.value);
                }}
              />
            </div>
          </div>
          </div>
      </AdminCard>

      {/* Student List */}
      {selectedClass ? (
        <AdminCard
          title={`Daftar Santri (${students.length > 0 ? `${students.length} Santri` : "Tidak ada santri"})`}
          action={
            <Button 
              onClick={handleSave} 
              disabled={saving || students.length === 0}
              className="gap-2"
              size="sm"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Simpan Absensi
            </Button>
          }
        >
            {students.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No</TableHead>
                    <TableHead className="w-[250px]">Nama Santri</TableHead>
                    <TableHead>Status Kehadiran</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>
                        <RadioGroup 
                          value={attendanceState[student.id] || "PRESENT"}
                          onValueChange={(val) => handleAttendanceChange(student.id, val)}
                          className="flex items-center gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="PRESENT" id={`r1-${student.id}`} className="text-green-600 border-green-600" />
                            <Label htmlFor={`r1-${student.id}`} className="text-green-700 font-medium">Hadir</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="LATE" id={`r2-${student.id}`} className="text-yellow-600 border-yellow-600" />
                            <Label htmlFor={`r2-${student.id}`} className="text-yellow-700">Telat</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="EXCUSED" id={`r3-${student.id}`} className="text-blue-600 border-blue-600" />
                            <Label htmlFor={`r3-${student.id}`} className="text-blue-700">Izin/Sakit</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ABSENT" id={`r4-${student.id}`} className="text-red-600 border-red-600" />
                            <Label htmlFor={`r4-${student.id}`} className="text-red-700">Alpha</Label>
                          </div>
                        </RadioGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Tidak ada santri terdaftar di kelas ini.
              </div>
            )}
        </AdminCard>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed">
          <p className="text-muted-foreground">Silakan pilih kelas terlebih dahulu untuk memulai absensi.</p>
        </div>
      )}
    </div>
  );
}
