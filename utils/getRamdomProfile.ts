import db from "../lib/db";
import type { Gender, User } from "../lib/generated/prisma";

const LIKE_EXPIRATION_DAYS = 90;

export async function getRandomProfile(
  userId: string,
  gender: Gender
): Promise<User | null> {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() - LIKE_EXPIRATION_DAYS);

  const total = await db.user.count({
    where: {
      id: { not: userId },
      isVisible: true,
      gender,
      likesReceived: {
        none: {
          fromUserId: userId,
          createdAt: { gt: expirationDate },
        },
      },
      AND: [
        {
          matchesA: { none: { userBId: userId } },
        },
        {
          matchesB: { none: { userAId: userId } },
        },
      ],
    },
  });

  if (total === 0) return null;

  const randomOffset = Math.floor(Math.random() * total);

  const [user] = await db.user.findMany({
    where: {
      id: { not: userId },
      isVisible: true,
      gender,
      likesReceived: {
        none: {
          fromUserId: userId,
          createdAt: { gt: expirationDate },
        },
      },
      AND: [
        {
          matchesA: { none: { userBId: userId } },
        },
        {
          matchesB: { none: { userAId: userId } },
        },
      ],
    },
    skip: randomOffset,
    take: 1,
  });

  return user || null;
}
