import { InlineKeyboard } from "grammy";

export const reportReasonKeyboard = new InlineKeyboard()
  .text("📢 Спам", "report-reason-spam")
  .row()
  .text("❌ Неадекват", "report-reason-bad")
  .row()
  .text("📸 Неподходящее фото", "report-reason-photo")
  .row()
  .text("💬 Оскорбления", "report-reason-abuse")
  .row()
  .text("🕵️‍♂️ Фейковый профиль", "report-reason-fake")
  .row()
  .text("💰 Мошенничество / просьбы о деньгах", "report-reason-scam")
  .row()
  .text("🔞 Неприемлемый контент", "report-reason-explicit")
  .row()
  .text("⬅️ Назад", "rate-profiles");
