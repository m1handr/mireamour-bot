import { InlineKeyboard } from "grammy";

export const rateLikesProfilesKeyboard = (alreadyRated: boolean) => {
  const keyboard = new InlineKeyboard();

  if (!alreadyRated) {
    keyboard
      .text("❤️", "like-profile")
      .text("👎", "dislike-profile")
      .row()
      .text("⚠️ Пожаловаться", "report-profile");
  }

  keyboard.row().text("⏪️", "likes-prev").text("⏩️", "likes-next");

  keyboard.row().text("⬅️ Назад", "menu");

  return keyboard;
};
