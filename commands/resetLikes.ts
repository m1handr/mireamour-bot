import type { MyContext } from "..";
import db from "../lib/db";

export const resetLikes = async (ctx: MyContext) => {
  await db.like.deleteMany();
  await db.match.deleteMany();
  ctx.reply("Сброшено все оценки и матчи");
};
