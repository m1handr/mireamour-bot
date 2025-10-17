import { InlineKeyboard } from "grammy";

export const matchesKeyboard = new InlineKeyboard()
  .text("⏪️", "left")
  .text("⏩️", "right")
  .row()
  .text("⬅️ Назад", "menu");
