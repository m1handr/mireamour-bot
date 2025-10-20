import { InlineKeyboard } from "grammy";

export const matchesKeyboard = new InlineKeyboard()
  .text("⏪️", "matches-prev")
  .text("⏩️", "matches-next")
  .row()
  .text("⬅️ Назад", "menu");
