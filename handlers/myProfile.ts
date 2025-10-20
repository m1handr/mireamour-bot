import { InputMediaBuilder } from "grammy";
import type { MyContext } from "..";
import { myProfileKeyboard } from "../keyboards/myProfileKeyboard";
import db from "../lib/db";
import { getProfileMessage } from "../utils/getProfileMessage";

export const myProfile = async (ctx: MyContext) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  const existUser = await db.user.findUnique({
    where: { id: userId.toString() },
  });

  if (!existUser) return;

  if (existUser.imageUrls?.[0]) {
    await ctx.editMessageMedia(
      InputMediaBuilder.photo(existUser.imageUrls[0], {
        caption: getProfileMessage(existUser),
        parse_mode: "HTML",
      }),
    );
    const keyboard = await myProfileKeyboard(ctx);
    await ctx.editMessageReplyMarkup({
      reply_markup: keyboard,
    });
  } else {
    await ctx.editMessageText(
      "Похоже, твоя анкета для знакомства ещё не заполнена 😅\n\n" +
        "Чтобы другие могли тебя найти и познакомиться, нужно её создать ✨",
    );
    await ctx.conversation.enter("create-profile");
  }

  await ctx.answerCallbackQuery();
};
