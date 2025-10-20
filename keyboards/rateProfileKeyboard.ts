import { InlineKeyboard } from "grammy";

export const rateProfileKeyboard = new InlineKeyboard()
  .text("❤️", "like-profile")
  .text("👎", "dislike-profile")
  .row()
  .text("⚠️ Пожаловаться", "report-profile")
  .row()
  .text("⬅️ Назад", "menu");
