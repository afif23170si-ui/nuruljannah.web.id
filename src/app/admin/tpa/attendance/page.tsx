import { Metadata } from "next";
import { getClasses, getStudents, getAttendance } from "@/actions/tpa";
import { AttendanceSheet } from "@/components/admin/tpa/AttendanceSheet";

export const metadata: Metadata = {
  title: "Absensi Santri",
  description: "Pencatatan kehadiran santri TPA",
};

interface AttendancePageProps {
  searchParams: {
    classId?: string;
    date?: string;
  };
}

export default async function AttendancePage({ searchParams }: AttendancePageProps) {
  const classes = await getClasses();
  
  let students: any[] = [];
  let attendanceData: any[] = [];

  if (searchParams.classId) {
    [students, attendanceData] = await Promise.all([
      getStudents({ 
        classId: searchParams.classId, 
        status: "ACTIVE",
        limit: 100 
      }),
      getAttendance(
        searchParams.classId,
        searchParams.date ? new Date(searchParams.date) : new Date()
      ),
    ]);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Absensi Harian</h1>
        <p className="text-muted-foreground">
          Catat kehadiran santri berdasarkan kelas dan tanggal
        </p>
      </div>
      
      <AttendanceSheet 
        classes={classes}
        students={students}
        attendanceData={attendanceData}
        initialClassId={searchParams.classId}
        initialDate={searchParams.date}
      />
    </div>
  );
}
