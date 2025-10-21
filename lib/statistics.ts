import db from "./db";

export interface StatsData {
  users: {
    total: number;
    active: number;
    newToday: number;
    newWeek: number;
    withPhotos: number;
    banned: number;
  };
  interactions: {
    likesTotal: number;
    likesToday: number;
    likesWeek: number;
    matchesTotal: number;
    matchesToday: number;
    matchesWeek: number;
    reportsTotal: number;
    reportsToday: number;
    reportsWeek: number;
  };
  engagement: {
    likesPerUser: number;
    matchesPerLike: number;
    activeToday: number;
  };
  demographics: {
    male: number;
    female: number;
    avgAge: number;
  };
}

export class StatisticsService {
  // Сбор полной статистики
  async collectFullStats(): Promise<StatsData> {
    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Пользователи
    const [
      totalUsers,
      activeUsers,
      newToday,
      newWeek,
      usersWithPhotos,
      bannedUsers,
      maleUsers,
      femaleUsers,
      avgAge,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { isVisible: true } }),
      db.user.count({ where: { createdAt: { gte: todayStart } } }),
      db.user.count({ where: { createdAt: { gte: weekAgo } } }),
      db.user.count({ where: { NOT: { imageUrls: { equals: [] } } } }),
      db.user.count({ where: { role: "banned" } }),
      db.user.count({ where: { gender: "male" } }),
      db.user.count({ where: { gender: "female" } }),
      db.user.aggregate({ _avg: { age: true } }),
    ]);

    // Взаимодействия
    const [
      likesTotal,
      likesToday,
      likesWeek,
      matchesTotal,
      matchesToday,
      matchesWeek,
      reportsTotal,
      reportsToday,
      reportsWeek,
    ] = await Promise.all([
      db.like.count({ where: { type: "like" } }),
      db.like.count({
        where: { type: "like", createdAt: { gte: todayStart } },
      }),
      db.like.count({ where: { type: "like", createdAt: { gte: weekAgo } } }),
      db.match.count(),
      db.match.count({ where: { createdAt: { gte: todayStart } } }),
      db.match.count({ where: { createdAt: { gte: weekAgo } } }),
      db.report.count(),
      db.report.count({ where: { createdAt: { gte: todayStart } } }),
      db.report.count({ where: { createdAt: { gte: weekAgo } } }),
    ]);

    // Активные пользователи за сегодня
    const activeTodayResult = await db.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(DISTINCT "fromUserId") as count 
      FROM "Like" 
      WHERE "createdAt" >= ${todayStart}
    `;
    const activeToday = Number(activeTodayResult[0]?.count || 0);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        newToday,
        newWeek,
        withPhotos: usersWithPhotos,
        banned: bannedUsers,
      },
      interactions: {
        likesTotal,
        likesToday,
        likesWeek,
        matchesTotal,
        matchesToday,
        matchesWeek,
        reportsTotal,
        reportsToday,
        reportsWeek,
      },
      engagement: {
        likesPerUser:
          totalUsers > 0 ? +(likesTotal / totalUsers).toFixed(2) : 0,
        matchesPerLike:
          likesTotal > 0 ? +(matchesTotal / likesTotal).toFixed(2) : 0,
        activeToday,
      },
      demographics: {
        male: maleUsers,
        female: femaleUsers,
        avgAge: +(avgAge._avg.age || 0).toFixed(1),
      },
    };
  }

  // Сбор быстрой статистики (только основные метрики)
  async collectQuickStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    likesToday: number;
    matchesToday: number;
    newUsersToday: number;
  }> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [totalUsers, activeUsers, likesToday, matchesToday, newUsersToday] =
      await Promise.all([
        db.user.count(),
        db.user.count({ where: { isVisible: true } }),
        db.like.count({
          where: { type: "like", createdAt: { gte: todayStart } },
        }),
        db.match.count({ where: { createdAt: { gte: todayStart } } }),
        db.user.count({ where: { createdAt: { gte: todayStart } } }),
      ]);

    return {
      totalUsers,
      activeUsers,
      likesToday,
      matchesToday,
      newUsersToday,
    };
  }

  // Статистика по пользователям (детальная)
  async collectUserStats(): Promise<{
    byGender: { male: number; female: number };
    byAge: { under20: number; age20to25: number; over25: number };
    withPhotos: number;
    banned: number;
  }> {
    const [maleUsers, femaleUsers, usersWithPhotos, bannedUsers, allUsers] =
      await Promise.all([
        db.user.count({ where: { gender: "male" } }),
        db.user.count({ where: { gender: "female" } }),
        db.user.count({ where: { NOT: { imageUrls: { equals: [] } } } }),
        db.user.count({ where: { role: "banned" } }),
        db.user.findMany({ select: { age: true } }),
      ]);

    const ageRanges = allUsers.reduce(
      (acc, user) => {
        if (!user.age) return acc;
        if (user.age < 20) acc.under20++;
        else if (user.age <= 25) acc.age20to25++;
        else acc.over25++;
        return acc;
      },
      { under20: 0, age20to25: 0, over25: 0 },
    );

    return {
      byGender: { male: maleUsers, female: femaleUsers },
      byAge: ageRanges,
      withPhotos: usersWithPhotos,
      banned: bannedUsers,
    };
  }

  // Статистика по активности
  async collectActivityStats(): Promise<{
    likes: { total: number; today: number; week: number };
    matches: { total: number; today: number; week: number };
    reports: { total: number; today: number; week: number };
    activeToday: number;
  }> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const weekAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      likesTotal,
      likesToday,
      likesWeek,
      matchesTotal,
      matchesToday,
      matchesWeek,
      reportsTotal,
      reportsToday,
      reportsWeek,
      activeTodayResult,
    ] = await Promise.all([
      db.like.count({ where: { type: "like" } }),
      db.like.count({
        where: { type: "like", createdAt: { gte: todayStart } },
      }),
      db.like.count({ where: { type: "like", createdAt: { gte: weekAgo } } }),
      db.match.count(),
      db.match.count({ where: { createdAt: { gte: todayStart } } }),
      db.match.count({ where: { createdAt: { gte: weekAgo } } }),
      db.report.count(),
      db.report.count({ where: { createdAt: { gte: todayStart } } }),
      db.report.count({ where: { createdAt: { gte: weekAgo } } }),
      db.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(DISTINCT "fromUserId") as count 
        FROM "Like" 
        WHERE "createdAt" >= ${todayStart}
      `,
    ]);

    const activeToday = Number(activeTodayResult[0]?.count || 0);

    return {
      likes: { total: likesTotal, today: likesToday, week: likesWeek },
      matches: { total: matchesTotal, today: matchesToday, week: matchesWeek },
      reports: { total: reportsTotal, today: reportsToday, week: reportsWeek },
      activeToday,
    };
  }
}

export const statsService = new StatisticsService();
