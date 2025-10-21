import { InlineKeyboard } from "grammy";
import type { MyContext } from "..";

export const detailedStatsCommand = async (ctx: MyContext) => {
  const adminId = process.env.ADMIN_CHAT_ID;
  if (!adminId || ctx.from?.id.toString() !== adminId) return;

  const keyboard = new InlineKeyboard()
    .text("📊 Общая", "stats_full")
    .text("📈 Быстрая", "stats_quick")
    .row()
    .text("👥 Пользователи", "stats_users")
    .row()
    .text("❤️ Активность", "stats_activity")
    .text("🚨 Жалобы", "stats_reports")
    .row()
    .text("🔄 Обновить", "stats_refresh");

  await ctx.reply("📊 *Панель статистики администратора*", {
    parse_mode: "Markdown",
    reply_markup: keyboard,
  });
};
