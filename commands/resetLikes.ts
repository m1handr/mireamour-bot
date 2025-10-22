import type { MyContext } from "..";
import db from "../lib/db";
import { config } from "../lib/env";

export const resetLikes = async (ctx: MyContext) => {
  if (ctx.from?.id.toString() !== config.ADMIN_CHAT_ID) return;

  await db.like.deleteMany();
  await db.match.deleteMany();

  ctx.reply("Сброшены все оценки и метчи");
};
