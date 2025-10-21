import { InlineKeyboard } from "grammy";

export const rateLikesProfilesKeyboard = new InlineKeyboard()
  .text("❤️", "like-profile")
  .text("👎", "dislike-profile")
  .row()
  .text("⚠️ Пожаловаться", "report-profile")
  .row()
  .text("⏪️", "likes-prev")
  .text("⏩️", "likes-next")
  .row()
  .text("⬅️ Назад", "menu");

// TODO: В данный момент, если нажать на кнопку оценки, то профиль оценится, но сразу после этого начнут выводится анкеты из общей ленты, а не лайки
