import { InlineKeyboard } from "grammy";
import type { MyContext } from "../bot-fabric";
import db from "../lib/db";

export const menuCommandKeyboard = async (ctx: MyContext) => {
  const userId = ctx.from?.id.toString();
  if (!userId) return new InlineKeyboard().text("Назад", "menu");

  const countOfMatches = await db.match.count({
    where: {
      OR: [{ userAId: userId }, { userBId: userId }],
    },
  });
  const countOfLikes = await db.like.count({
    where: { toUserId: userId, type: "like" },
  });

  const keyboard = new InlineKeyboard()
    .text("👀 Смотреть анкеты", "rate-profiles")
    .row()
    .text(`💕 Метчи (${countOfMatches})`, "matches")
    .text(`👍 Лайки (${countOfLikes})`, "likes")
    .row()
    .text("👤 Моя анкета", "my-profile")
    .row()
    .url("📱 Наш ТГК", `https://t.me/${ctx.botConfig.channelUsername}`);

  return keyboard;
};
