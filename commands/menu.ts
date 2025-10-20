import type { MyContext } from "..";
import { menuCommandKeyboard } from "../keyboards/menuCommandKeyboard";
import { ensureUsername } from "../utils/ensureUsername";
import { getMenuMessage } from "../utils/getMenuMessage";
import { removeLastProfileButtons } from "../utils/removeLastProfileButtons";

export const menuCommand = async (ctx: MyContext) => {
  const message = await getMenuMessage(ctx);

  await removeLastProfileButtons(ctx);
  await ensureUsername(ctx);

  const keyboard = await menuCommandKeyboard(ctx);
  return ctx.reply(message, {
    reply_markup: keyboard,
    parse_mode: "HTML",
  });
};
