"use server";

import prisma from "@/lib/prisma";
import { revalidateTag, unstable_cache } from "next/cache";
import { StudentStatus, AttendanceStatus } from "@prisma/client";

// ==========================================
// DASHBOARD STATS
// ==========================================

export async function getTpaStats() {
  const [studentsCount, teachersCount, classesCount, activeStudents] = await Promise.all([
    prisma.tpaStudent.count(),
    prisma.tpaTeacher.count({ where: { isActive: true } }),
    prisma.tpaClass.count({ where: { isActive: true } }),
    prisma.tpaStudent.count({ where: { status: "ACTIVE" } }),
  ]);

  return {
    students: studentsCount,
    activeStudents,
    teachers: teachersCount,
    classes: classesCount,
  };
}

// ==========================================
// TEACHER MANAGEMENT
// ==========================================

export const getTeachers = unstable_cache(
  async () => {
    const teachers = await prisma.tpaTeacher.findMany({
      orderBy: { name: "asc" },
    });
    
    // Manual count aggregation to avoid include issues
    const classCounts = await prisma.tpaClass.groupBy({
      by: ["teacherId"],
      _count: { _all: true },
    });

    return teachers.map(teacher => {
      const count = classCounts.find(c => c.teacherId === teacher.id)?._count._all || 0;
      return {
        ...teacher,
        _count: { classes: count }
      };
    });
  },
  ["teachers"],
  { tags: ["teachers"] }
);

export async function createTeacher(data: {
  name: string;
  phone?: string;
  email?: string;
  bio?: string;
  photo?: string;
}) {
  const result = await prisma.tpaTeacher.create({
    data,
  });
  revalidateTag("teachers", "max");
  return result;
}

export async function updateTeacher(
  id: string,
  data: Partial<{
    name: string;
    phone: string;
    email: string;
    bio: string;
    photo: string;
    isActive: boolean;
  }>
) {
  const result = await prisma.tpaTeacher.update({
    where: { id },
    data,
  });
  revalidateTag("teachers", "max");
  return result;
}

export async function deleteTeacher(id: string) {
  // Check for classes first? Prisma might restrict delete if relation exists, 
  // but we didn't set Cascade on Teacher->Class (optional relation).
  await prisma.tpaTeacher.delete({ where: { id } });
  revalidateTag("teachers", "max");
}

// ==========================================
// CLASS MANAGEMENT
// ==========================================

export const getClasses = unstable_cache(
  async () => {
    const classes = await prisma.tpaClass.findMany({
      orderBy: { name: "asc" },
    });
    
    // Fetch teachers manual
    const teacherIds = classes.map(c => c.teacherId).filter(Boolean) as string[];
    const teachers = await prisma.tpaTeacher.findMany({
      where: { id: { in: teacherIds } },
      select: { id: true, name: true }
    });

    // Fetch student counts manual
    const studentCounts = await prisma.tpaStudent.groupBy({
      by: ["classId"],
      _count: { _all: true },
    });

    return classes.map(cls => {
      const teacher = teachers.find(t => t.id === cls.teacherId);
      const count = studentCounts.find(c => c.classId === cls.id)?._count._all || 0;
      return {
        ...cls,
        teacher: teacher ? { name: teacher.name } : null,
        _count: { students: count }
      };
    });
  },
  ["classes"],
  { tags: ["classes"] }
);

export async function createClass(data: {
  name: string;
  description?: string;
  schedule?: string;
  teacherId?: string;
}) {
  const result = await prisma.tpaClass.create({
    data,
  });
  revalidateTag("classes", "max");
  return result;
}

export async function updateClass(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    schedule: string;
    teacherId: string;
    isActive: boolean;
  }>
) {
  const result = await prisma.tpaClass.update({
    where: { id },
    data,
  });
  revalidateTag("classes", "max");
  return result;
}

export async function deleteClass(id: string) {
  await prisma.tpaClass.delete({ where: { id } });
  revalidateTag("classes", "max");
}

// ==========================================
// STUDENT MANAGEMENT
// ==========================================

export async function getStudents(options?: {
  classId?: string;
  status?: StudentStatus;
  limit?: number;
  search?: string;
}) {
  const where: any = {};
  
  if (options?.classId) where.classId = options.classId;
  if (options?.status) where.status = options.status;
  if (options?.search) {
    where.OR = [
      { name: { contains: options.search, mode: "insensitive" } },
      { parentName: { contains: options.search, mode: "insensitive" } },
    ];
  }

  const students = await prisma.tpaStudent.findMany({
    where,
    orderBy: { name: "asc" },
    take: options?.limit,
  });
  
  // Manual fetch classes
  const classIds = students.map(s => s.classId).filter(Boolean) as string[];
  const classes = await prisma.tpaClass.findMany({
    where: { id: { in: classIds } },
    select: { id: true, name: true }
  });

  return students.map(student => ({
    ...student,
    class: classes.find(c => c.id === student.classId)
  }));
}

export async function createStudent(data: {
  name: string;
  birthDate?: Date;
  parentName?: string;
  parentPhone?: string;
  address?: string;
  classId?: string;
}) {
  const result = await prisma.tpaStudent.create({
    data,
  });
  revalidateTag("students", "max");
  revalidateTag("classes", "max"); 
  return result;
}

export async function updateStudent(
  id: string,
  data: Partial<{
    name: string;
    birthDate: Date;
    parentName: string;
    parentPhone: string;
    address: string;
    classId: string;
    status: StudentStatus;
  }>
) {
  const result = await prisma.tpaStudent.update({
    where: { id },
    data,
  });
  revalidateTag("students", "max");
  revalidateTag("classes", "max");
  return result;
}

export async function deleteStudent(id: string) {
  await prisma.tpaStudent.delete({ where: { id } });
  revalidateTag("students", "max");
  revalidateTag("classes", "max");
}

// ==========================================
// ATTENDANCE
// ==========================================

export async function getAttendance(classId: string, date: Date) {
  const attendance = await prisma.tpaAttendance.findMany({
    where: {
      date,
      student: {
        classId,
      },
    },
  });
  
  // Need student names? Yes for the usage in page
  // But wait, the previous code included student: { select: { name: true } }
  // This relation (attendance -> student) might also be broken if relations are issue.
  // Let's safe guard this too by fetching students separately if needed, 
  // BUT the AttendanceSheet passed `students` list separately!
  // Checks `src/app/admin/tpa/attendance/page.tsx`:
  // It calls `getStudents` (which puts student data in a list) AND `getAttendance`.
  // The `AttendanceSheet` uses `students` array to list rows, and `attendanceData` to check status.
  // The `attendanceData` only needs `studentId` and `status`.
  // The `getAttendance` above included `student: { name }`. I probably don't need it in the Sheet.
  
  return attendance;
}

export async function submitAttendance(data: {
  studentId: string;
  date: Date;
  status: AttendanceStatus;
  notes?: string;
}) {
  const result = await prisma.tpaAttendance.upsert({
    where: {
      studentId_date: {
        studentId: data.studentId,
        date: data.date,
      },
    },
    update: {
      status: data.status,
      notes: data.notes,
    },
    create: {
      studentId: data.studentId,
      date: data.date,
      status: data.status,
      notes: data.notes,
    },
  });
  return result;
}
