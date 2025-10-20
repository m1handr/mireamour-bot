import type { MyContext } from "..";
import { menuCommandKeyboard } from "../keyboards/menuCommandKeyboard";
import { getMenuMessage } from "../utils/getMenuMessage";

export const menu = async (ctx: MyContext) => {
  const message = await getMenuMessage(ctx);
  await ctx.deleteMessage();
  await ctx.reply(message, {
    reply_markup: menuCommandKeyboard,
    parse_mode: "HTML",
  });
  await ctx.answerCallbackQuery();
};
