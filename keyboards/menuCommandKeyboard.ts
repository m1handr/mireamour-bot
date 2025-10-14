import { InlineKeyboard } from "grammy";

export const menuCommandKeyboard = new InlineKeyboard()
  .text("👀 Смотреть анкеты", "view-profiles")
  .row()
  .text("💕 Метчи", "matches")
  .text("👤 Моя анкета", "my-profile");
