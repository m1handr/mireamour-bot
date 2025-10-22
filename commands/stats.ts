import type { MyContext } from "..";
import { config } from "../lib/env";
import { logger } from "../lib/logger";
import { statsService } from "../lib/statistics";

export const statsCommand = async (ctx: MyContext) => {
  if (ctx.from?.id.toString() !== config.ADMIN_CHAT_ID) return;

  try {
    await ctx.reply("📊 Собираю статистику...");

    const stats = await statsService.collectFullStats();

    const message = `
📈 *СТАТИСТИКА БОТА - ОБЩАЯ*

👥 *ПОЛЬЗОВАТЕЛИ:*
├ Всего: ${stats.users.total}
├ Активных: ${stats.users.active}
├ Новых сегодня: ${stats.users.newToday}
├ Новых за неделю: ${stats.users.newWeek}
├ С фото: ${stats.users.withPhotos}
└ Заблокировано: ${stats.users.banned}

❤️ *ВЗАИМОДЕЙСТВИЯ:*
├ Лайков всего: ${stats.interactions.likesTotal}
├ Лайков сегодня: ${stats.interactions.likesToday}
├ Лайков за неделю: ${stats.interactions.likesWeek}
├ Метчей всего: ${stats.interactions.matchesTotal}
├ Метчей сегодня: ${stats.interactions.matchesToday}
├ Метчей за неделю: ${stats.interactions.matchesWeek}
├ Жалоб всего: ${stats.interactions.reportsTotal}
├ Жалоб сегодня: ${stats.interactions.reportsToday}
└ Жалоб за неделю: ${stats.interactions.reportsWeek}

📊 *ЭНГЕЙДЖМЕНТ:*
├ Лайков на пользователя: ${stats.engagement.likesPerUser}
├ Конверсия в метч: ${(stats.engagement.matchesPerLike * 100).toFixed(1)}%
└ Активных сегодня: ${stats.engagement.activeToday}

👫 *ДЕМОГРАФИЯ:*
├ Парней: ${stats.demographics.male} (${(
      (stats.demographics.male / stats.users.total) * 100
    ).toFixed(1)}%)
├ Девушек: ${stats.demographics.female} (${(
      (stats.demographics.female / stats.users.total) * 100
    ).toFixed(1)}%)
└ Средний возраст: ${stats.demographics.avgAge}

⏱ *ОБНОВЛЕНО:* ${new Date().toLocaleString("ru-RU")}
    `.trim();

    await ctx.reply(message, {
      parse_mode: "Markdown",
      link_preview_options: { is_disabled: true },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error({ err: errorMessage }, "Ошибка сбора статистики");
    await ctx.reply("❌ Произошла ошибка при сборе статистики");
  }
};
