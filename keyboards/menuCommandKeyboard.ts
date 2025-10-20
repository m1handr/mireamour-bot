import { InlineKeyboard } from "grammy";
import type { MyContext } from "..";
import db from "../lib/db";

export const menuCommandKeyboard = async (ctx: MyContext) => {
  const userId = ctx.from?.id.toString();
  if (!userId) return new InlineKeyboard().text("Назад", "menu");

  const countOfMatches = await db.match.count({
    where: {
      OR: [{ userAId: userId }, { userBId: userId }],
    },
  });

  const keyboard = new InlineKeyboard()
    .text("👀 Смотреть анкеты", "rate-profiles")
    .row()
    .text(`💕 Метчи (${countOfMatches})`, "matches")
    .text("👤 Моя анкета", "my-profile");

  return keyboard;
};
