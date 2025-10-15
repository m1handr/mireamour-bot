import type { NextFunction } from "grammy";
import type { MyContext } from "..";

export const deleteUserMessage = async (ctx: MyContext, next: NextFunction) => {
  const chatId = ctx.chat?.id;
  if (!chatId) return next();

  const messageId = ctx.message?.message_id;
  if (!messageId) return next();

  setTimeout(async () => {
    await ctx.api.deleteMessage(chatId, messageId);
  }, 500);

  return next();
};
