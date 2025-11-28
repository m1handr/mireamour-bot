import type { MyContext } from "../bot-fabric";
import db from "../lib/db";

export const ensureUsername = async (ctx: MyContext) => {
  const userId = ctx.from?.id.toString();
  if (!userId) return;

  const existUser = await db.user.findUnique({
    where: { id: userId },
  });

  if (!existUser) return;

  if (ctx.from?.username && ctx.from.username !== existUser.username) {
    await db.user.update({
      where: { id: userId.toString() },
      data: { username: ctx.from.username },
    });
  }
};
