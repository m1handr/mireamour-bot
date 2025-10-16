import type { MyContext } from "..";
import db from "../lib/db";

export const resetProfile = async (ctx: MyContext) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  await db.user.delete({
    where: { id: userId.toString() },
  });

  await ctx.reply("Профиль удалён!");
};
