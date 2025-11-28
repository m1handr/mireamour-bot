import type { MyContext } from "../bot-fabric";
import { menuCommandKeyboard } from "../keyboards/menuCommandKeyboard";
import { ensureUsername } from "../utils/ensureUsername";
import { getMenuMessage } from "../utils/getMenuMessage";
import { isSubscribed } from "../utils/isSubscribed";

export const menu = async (ctx: MyContext) => {
  const message = await getMenuMessage(ctx, ctx.botConfig.name);
  await ensureUsername(ctx);
  const subscribed = await isSubscribed(ctx);
  if (!subscribed) return;

  await ctx.deleteMessage();

  const keyboard = await menuCommandKeyboard(ctx);
  await ctx.reply(message, {
    reply_markup: keyboard,
    parse_mode: "HTML",
  });
  await ctx.answerCallbackQuery();
};
