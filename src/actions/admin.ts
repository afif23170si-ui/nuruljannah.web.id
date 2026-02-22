"use server";

import prisma from "@/lib/prisma";

// Dashboard Stats
export async function getDashboardStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const [
    usersCount,
    postsCount,
    publishedPostsCount,
    financeSummary,
    monthlyFinanceSummary,
    studentsCount,
    recentPosts,
    recentFinance,
    upcomingEvents,
    perFundSummary,
    funds,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.finance.groupBy({
      by: ["type"],
      _sum: { amount: true },
    }),
    prisma.finance.groupBy({
      by: ["type"],
      where: { date: { gte: startOfMonth, lte: endOfMonth } },
      _sum: { amount: true },
    }),
    prisma.tpaStudent.count({ where: { status: "ACTIVE" } }),
    prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    }),
    prisma.finance.findMany({
      take: 5,
      orderBy: { date: "desc" },
      include: { creator: { select: { name: true } }, fund: { select: { name: true } } },
    }),
    prisma.mosqueEvent.findMany({
      where: { isActive: true },
      take: 3,
      orderBy: [{ time: "asc" }],
    }),
    prisma.finance.groupBy({
      by: ["fundId", "type"],
      _sum: { amount: true },
    }),
    prisma.fund.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const income =
    financeSummary.find((f) => f.type === "INCOME")?._sum.amount || 0;
  const expense =
    financeSummary.find((f) => f.type === "EXPENSE")?._sum.amount || 0;
  
  const monthlyIncome =
    monthlyFinanceSummary.find((f) => f.type === "INCOME")?._sum.amount || 0;
  const monthlyExpense =
    monthlyFinanceSummary.find((f) => f.type === "EXPENSE")?._sum.amount || 0;

  // Build per-fund balances
  const fundBalances = funds.map((fund) => {
    const fundIncome = perFundSummary
      .filter((s) => s.fundId === fund.id && s.type === "INCOME")
      .reduce((acc, s) => acc + Number(s._sum.amount || 0), 0);
    const fundExpense = perFundSummary
      .filter((s) => s.fundId === fund.id && s.type === "EXPENSE")
      .reduce((acc, s) => acc + Number(s._sum.amount || 0), 0);
    return {
      id: fund.id,
      name: fund.name,
      balance: fundIncome - fundExpense,
    };
  });

  return {
    users: usersCount,
    posts: postsCount,
    publishedPosts: publishedPostsCount,
    students: studentsCount,
    income: Number(income),
    expense: Number(expense),
    balance: Number(income) - Number(expense),
    monthlyIncome: Number(monthlyIncome),
    monthlyExpense: Number(monthlyExpense),
    fundBalances,
    recentPosts,
    recentFinance: recentFinance.map((f) => ({
      ...f,
      amount: Number(f.amount),
      fundName: f.fund?.name || "Operasional",
    })),
    upcomingEvents,
  };
}

// Article CRUD
export async function getArticles(status?: string) {
  return prisma.post.findMany({
    where: status ? { status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" } : {},
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true, image: true } } },
  });
}

export async function getArticleById(id: string) {
  return prisma.post.findUnique({
    where: { id },
    include: { author: { select: { name: true } } },
  });
}

export async function createArticle(data: {
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  status: string;
  coverImage?: string;
  authorId: string;
}) {
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  return prisma.post.create({
    data: {
      ...data,
      slug: `${slug}-${Date.now()}`,
      category: data.category as "ARTIKEL" | "BERITA" | "PENGUMUMAN" | "KAJIAN" | "KHUTBAH",
      status: data.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
    },
  });
}

export async function updateArticle(
  id: string,
  data: {
    title?: string;
    content?: string;
    excerpt?: string;
    category?: string;
    status?: string;
    coverImage?: string;
  }
) {
  const updateData: Record<string, unknown> = { ...data };

  if (data.title) {
    updateData.slug =
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim() + `-${Date.now()}`;
  }

  if (data.status === "PUBLISHED") {
    updateData.publishedAt = new Date();
  }

  return prisma.post.update({
    where: { id },
    data: updateData as Parameters<typeof prisma.post.update>[0]["data"],
  });
}

export async function deleteArticle(id: string) {
  return prisma.post.delete({ where: { id } });
}

// Kajian CRUD
export async function getKajianList() {
  return prisma.kajianSchedule.findMany({
    orderBy: [{ dayOfWeek: "asc" }, { time: "asc" }],
  });
}

export async function createKajian(data: {
  title: string;
  speaker: string;
  topic?: string;
  dayOfWeek: number;
  time: string;
  location?: string;
}) {
  return prisma.kajianSchedule.create({ data });
}

export async function updateKajian(
  id: string,
  data: Partial<{
    title: string;
    speaker: string;
    topic: string;
    dayOfWeek: number;
    time: string;
    location: string;
    isActive: boolean;
  }>
) {
  return prisma.kajianSchedule.update({ where: { id }, data });
}

export async function deleteKajian(id: string) {
  return prisma.kajianSchedule.delete({ where: { id } });
}

// ==========================================
// Mosque Event CRUD (Agenda Masjid)
// ==========================================

export async function getEventList(category?: string) {
  return prisma.mosqueEvent.findMany({
    where: category ? { category: category as never } : {},
    orderBy: [{ isRecurring: "desc" }, { dayOfWeek: "asc" }, { date: "asc" }, { time: "asc" }],
  });
}

export async function getEventById(id: string) {
  return prisma.mosqueEvent.findUnique({ where: { id } });
}

export async function createEvent(data: {
  title: string;
  description?: string;
  category: string;
  date?: Date | null;
  dayOfWeek?: number | null;
  time: string;
  endTime?: string;
  location?: string;
  speaker?: string;
  isRecurring: boolean;
}) {
  return prisma.mosqueEvent.create({
    data: {
      ...data,
      category: data.category as never,
    },
  });
}

export async function updateEvent(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    category: string;
    date: Date | null;
    dayOfWeek: number | null;
    time: string;
    endTime: string;
    location: string;
    speaker: string;
    isRecurring: boolean;
    isActive: boolean;
  }>
) {
  const updateData: Record<string, unknown> = { ...data };
  if (data.category) {
    updateData.category = data.category as never;
  }
  return prisma.mosqueEvent.update({
    where: { id },
    data: updateData as Parameters<typeof prisma.mosqueEvent.update>[0]["data"],
  });
}

export async function deleteEvent(id: string) {
  return prisma.mosqueEvent.delete({ where: { id } });
}
