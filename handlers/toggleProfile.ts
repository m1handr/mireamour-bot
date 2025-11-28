import type { MyContext } from "../bot-fabric";
import { myProfileKeyboard } from "../keyboards/myProfileKeyboard";
import db from "../lib/db";

export const enableProfile = async (ctx: MyContext) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  await db.user.update({
    where: { id: userId.toString() },
    data: { isVisible: true },
  });

  await ctx.answerCallbackQuery({
    text: "Профиль снова активен ✨",
  });

  await ctx.editMessageReplyMarkup({
    reply_markup: await myProfileKeyboard(ctx),
  });

  await ctx.answerCallbackQuery();
};

export const disableProfile = async (ctx: MyContext) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  await db.user.update({
    where: { id: userId.toString() },
    data: { isVisible: false },
  });

  await ctx.answerCallbackQuery({
    text: "Профиль скрыт 👻",
  });

  await ctx.editMessageReplyMarkup({
    reply_markup: await myProfileKeyboard(ctx),
  });

  await ctx.answerCallbackQuery();
};
