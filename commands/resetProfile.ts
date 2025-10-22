import type { MyContext } from "..";
import db from "../lib/db";
import { config } from "../lib/env";

export const resetProfile = async (ctx: MyContext) => {
  if (ctx.from?.id.toString() !== config.ADMIN_CHAT_ID) return;

  const userId = ctx.from?.id;
  if (!userId) return;

  await db.user.delete({
    where: { id: userId.toString() },
  });

  await ctx.reply("Профиль удалён!");
};
