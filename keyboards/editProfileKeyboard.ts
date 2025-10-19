import { InlineKeyboard } from "grammy";

export const editProfileKeyboard = new InlineKeyboard()
  .text("✏️ Изменить имя", "edit-name")
  .row()
  .text("✏️ Изменить описание", "edit-description")
  .text("✏️ Изменить фото", "edit-photo")
  .row()
  .text("✏️ Изменить возраст", "edit-age")
  .text("✏️ Изменить пол", "edit-gender")
  .row()
  .text("⬅️ Назад", "my-profile");
