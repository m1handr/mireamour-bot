import db from "../lib/db";
import type { User } from "../lib/generated/prisma";

export async function getUsersWhoLikedMe(userId: string): Promise<User[]> {
  const likes = await db.like.findMany({
    where: { toUserId: userId, type: "like" },
    include: { fromUser: true },
    orderBy: { createdAt: "desc" },
  });

  return likes.map((like) => like.fromUser);
}
