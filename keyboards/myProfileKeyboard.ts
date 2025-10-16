import { InlineKeyboard } from "grammy";

export const myProfileKeyboard = new InlineKeyboard()
  .text("📝 Редактировать профиль", "edit-profile")
  .row()
  .text("📵 Отключить анкету", "disable-profile")
  .row()
  .text("Назад", "menu");
