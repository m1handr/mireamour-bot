import type { NextFunction } from "grammy";
import { botsConfig } from "../bot-config";
import type { MyContext } from "../bot-fabric";
import db from "../lib/db";

export const checkUniversity = async (ctx: MyContext, next: NextFunction) => {
  const chatId = ctx.chat?.id.toString();
  if (!chatId) return next();

  const existUser = await db.user.findUnique({
    where: {
      id: chatId,
    },
  });

  if (existUser && existUser?.university !== ctx.botConfig.name) {
    await ctx.reply(
      `🚫 Пожалуйста, воспользуйтесь ботом своего университета! 😔\nhttps://t.me/${
        botsConfig.find((b) => b.name === existUser?.university)?.botUsername
      }`
    );
    return;
  }

  return next();
};
