import { InputMediaBuilder } from "grammy";
import type { MyContext } from "..";
import db from "../lib/db";

export const myProfile = async (ctx: MyContext) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  let existUser = await db.user.findUnique({
    where: { id: userId.toString() },
  });

  if (!existUser) return;

  if (existUser.imageUrls && existUser.imageUrls[0]) {
    await ctx.editMessageMedia(
      InputMediaBuilder.photo(existUser.imageUrls[0], {
        caption: `<b>${existUser.name}, ${
          existUser.age || "возраст не указан"
        }</b>`,
        parse_mode: "HTML",
      })
    );
  } else {
    await ctx.editMessageText(
      "Похоже, твоя анкета для знакомства ещё не заполнена 😅\n\n" +
        "Чтобы другие могли тебя найти и познакомиться, нужно её создать ✨"
    );
    await ctx.conversation.enter("create-profile");
  }

  await ctx.answerCallbackQuery();
};
