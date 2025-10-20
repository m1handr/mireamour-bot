import { InlineKeyboard } from "grammy";
import type { MyContext } from "..";
import db from "../lib/db";

export const myProfileKeyboard = async (ctx: MyContext) => {
  const userId = ctx.from?.id;
  if (!userId) return new InlineKeyboard().text("Назад", "menu");

  const user = await db.user.findUnique({
    where: { id: userId.toString() },
    select: { isVisible: true },
  });

  const keyboard = new InlineKeyboard()
    .text("📝 Заполнить профиль заново", "recreate-profile")
    .row();

  if (user?.isVisible) {
    keyboard.text("👻 Скрыть анкету", "disable-profile");
  } else {
    keyboard.text("📢 Включить анкету", "enable-profile");
  }

  keyboard.row().text("⬅️ Назад", "menu");

  return keyboard;
};
