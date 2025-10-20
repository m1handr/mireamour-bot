import { InlineKeyboard } from "grammy";

export const menuCommandKeyboard = new InlineKeyboard()
  .text("👀 Смотреть анкеты", "rate-profiles")
  .row()
  .text("💕 Метчи", "matches")
  .text("👤 Моя анкета", "my-profile");
