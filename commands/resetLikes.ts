import type { MyContext } from "..";
import db from "../lib/db";

export const resetLikes = async (ctx: MyContext) => {
  const adminId = process.env.ADMIN_CHAT_ID;
  if (!adminId || ctx.from?.id.toString() !== adminId) return;

  await db.like.deleteMany();
  await db.match.deleteMany();

  ctx.reply("Сброшены все оценки и метчи");
};
