// Prevent static generation - render on demand only
export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import { Metadata } from "next";
import { getClasses, getStudents, getAttendance } from "@/actions/tpa";
import { AttendanceSheet } from "@/components/admin/tpa/AttendanceSheet";
import { Loader2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";

export const metadata: Metadata = {
  title: "Absensi Santri",
  description: "Pencatatan kehadiran santri TPA",
};

interface AttendancePageProps {
  searchParams: Promise<{
    classId?: string;
    date?: string;
  }>;
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center p-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export default async function AttendancePage({ searchParams }: AttendancePageProps) {
  const params = await searchParams;
  const classes = await getClasses();
  
  let students: any[] = [];
  let attendanceData: any[] = [];

  if (params.classId) {
    [students, attendanceData] = await Promise.all([
      getStudents({ 
        classId: params.classId, 
        status: "ACTIVE",
        limit: 100 
      }),
      getAttendance(
        params.classId,
        params.date ? new Date(params.date) : new Date()
      ),
    ]);
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Absensi Harian" 
        description="Catat kehadiran santri berdasarkan kelas dan tanggal"
        breadcrumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "TPA", href: "/admin/tpa" },
            { label: "Absensi" }
        ]}
      />
      
      <Suspense fallback={<LoadingFallback />}>
        <AttendanceSheet 
          classes={classes}
          students={students}
          attendanceData={attendanceData}
          initialClassId={params.classId}
          initialDate={params.date}
        />
      </Suspense>
    </div>
  );
}
