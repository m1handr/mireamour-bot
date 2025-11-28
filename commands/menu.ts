import type { MyContext } from "../bot-fabric";
import { menuCommandKeyboard } from "../keyboards/menuCommandKeyboard";
import { ensureUsername } from "../utils/ensureUsername";
import { getMenuMessage } from "../utils/getMenuMessage";
import { isSubscribed } from "../utils/isSubscribed";
import { removeLastProfileButtons } from "../utils/removeLastProfileButtons";

export const menuCommand = async (ctx: MyContext) => {
  const message = await getMenuMessage(ctx, ctx.botConfig.name);

  await removeLastProfileButtons(ctx);
  await ensureUsername(ctx);
  const subscribed = await isSubscribed(ctx);
  if (!subscribed) return;

  const keyboard = await menuCommandKeyboard(ctx);
  return ctx.reply(message, {
    reply_markup: keyboard,
    parse_mode: "HTML",
  });
};
