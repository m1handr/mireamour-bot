import type { MyContext } from "..";
import { menuCommandKeyboard } from "../keyboards/menuCommandKeyboard";
import { ensureUsername } from "../utils/ensureUsername";
import { getMenuMessage } from "../utils/getMenuMessage";

export const menu = async (ctx: MyContext) => {
  const message = await getMenuMessage(ctx);
  await ensureUsername(ctx);

  await ctx.deleteMessage();

  const keyboard = await menuCommandKeyboard(ctx);
  await ctx.reply(message, {
    reply_markup: keyboard,
    parse_mode: "HTML",
  });
  await ctx.answerCallbackQuery();
};
