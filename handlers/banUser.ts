import type { MyContext } from "..";
import db from "../lib/db";

export async function banUser(ctx: MyContext, userId: string) {
  try {
    const user = await db.user.update({
      where: { id: userId },
      data: { role: "banned", isVisible: false },
    });

    await ctx.answerCallbackQuery({
      text: `🚫 Пользователь ${user.name} заблокирован`,
    });
    await ctx.editMessageReplyMarkup({
      reply_markup: undefined,
    });
    await ctx.reply(`Пользователь ${user.name} был заблокирован 🚫`);
  } catch (error) {
    console.error("Ошибка при бане пользователя:", error);
    await ctx.answerCallbackQuery({
      text: "Ошибка при блокировке пользователя 😅",
    });
  }
}
