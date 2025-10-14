import type { Context } from "grammy";
import { getMenuMessage } from "../commands/menu";
import { menuCommandKeyboard } from "../keyboards/menuCommandKeyboard";

export const menu = async (ctx: Context) => {
  const message = await getMenuMessage(ctx);
  await ctx.deleteMessage();
  await ctx.reply(message, {
    reply_markup: menuCommandKeyboard,
    parse_mode: "HTML",
  });
  await ctx.answerCallbackQuery();
};
