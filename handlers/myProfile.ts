import { eq } from "drizzle-orm";
import { InputMediaBuilder, type Context } from "grammy";
import { myProfileKeyboard } from "../keyboards/myProfileKeyboard";
import { db, users } from "../lib/drizzle";

export const myProfile = async (ctx: Context) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  const [existUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId.toString()));
  if (!existUser) return;

  await ctx.editMessageMedia(
    InputMediaBuilder.photo(
      "https://storage.yandexcloud.net/artel-dev/images/nprab75tgkfbr2xh3l06lsng.webp",
      {
        caption: `<b>${existUser.name}, ${existUser.age}</b>`,
        parse_mode: "HTML",
      }
    )
  );
  await ctx.editMessageReplyMarkup({ reply_markup: myProfileKeyboard });
  await ctx.answerCallbackQuery();
};
