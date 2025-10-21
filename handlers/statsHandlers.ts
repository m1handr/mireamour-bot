import type { MyContext } from "..";
import { detailedStatsCommand } from "../commands/detailedStats";
import { logger } from "../lib/logger";
import { statsService } from "../lib/statistics";

export const handleStatsFull = async (ctx: MyContext) => {
  try {
    const stats = await statsService.collectFullStats();

    const message = `
📈 *ПОЛНАЯ СТАТИСТИКА*

👥 *Пользователи:*
├ Всего: ${stats.users.total}
├ Активных: ${stats.users.active}
├ Новых сегодня: ${stats.users.newToday}
├ С фото: ${stats.users.withPhotos}
└ Заблокировано: ${stats.users.banned}

❤️ *Активность:*
├ Лайков: ${stats.interactions.likesTotal}
├ Лайков сегодня: ${stats.interactions.likesToday}
├ Метчей: ${stats.interactions.matchesTotal}
├ Метчей сегодня: ${stats.interactions.matchesToday}
└ Активных юзеров: ${stats.engagement.activeToday}

📊 *Эффективность:*
├ Лайков/юзера: ${stats.engagement.likesPerUser}
└ Конверсия: ${(stats.engagement.matchesPerLike * 100).toFixed(1)}%

👫 *Демография:*
├ Парней: ${stats.demographics.male}
├ Девушек: ${stats.demographics.female}
└ Средний возраст: ${stats.demographics.avgAge}
    `.trim();

    await ctx.editMessageText(message, {
      parse_mode: "Markdown",
      reply_markup: ctx.callbackQuery?.message?.reply_markup,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error({ err: errorMessage }, "Ошибка обработки stats_full");
    await ctx.answerCallbackQuery({ text: "❌ Ошибка загрузки статистики" });
  }
};

export const handleStatsUsers = async (ctx: MyContext) => {
  try {
    const userStats = await statsService.collectUserStats();

    const message = `
👥 *СТАТИСТИКА ПОЛЬЗОВАТЕЛЕЙ*

🚻 *По полу:*
├ Парней: ${userStats.byGender.male} (${(
      (userStats.byGender.male /
        (userStats.byGender.male + userStats.byGender.female)) *
        100
    ).toFixed(1)}%)
└ Девушек: ${userStats.byGender.female} (${(
      (userStats.byGender.female /
        (userStats.byGender.male + userStats.byGender.female)) *
        100
    ).toFixed(1)}%)

🎂 *По возрасту:*
├ До 20 лет: ${userStats.byAge.under20}
├ 20-25 лет: ${userStats.byAge.age20to25}
└ Старше 25: ${userStats.byAge.over25}

📸 *Профили:*
├ С фотографиями: ${userStats.withPhotos}
└ Заблокировано: ${userStats.banned}
    `.trim();

    await ctx.editMessageText(message, {
      parse_mode: "Markdown",
      reply_markup: ctx.callbackQuery?.message?.reply_markup,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error({ err: errorMessage }, "Ошибка обработки stats_users");
    await ctx.answerCallbackQuery({ text: "❌ Ошибка загрузки статистики" });
  }
};

export const handleStatsActivity = async (ctx: MyContext) => {
  try {
    const activityStats = await statsService.collectActivityStats();

    const message = `
❤️ *СТАТИСТИКА АКТИВНОСТИ*

👍 *Лайки:*
├ Всего: ${activityStats.likes.total}
├ Сегодня: ${activityStats.likes.today}
└ За неделю: ${activityStats.likes.week}

💑 *Метчи:*
├ Всего: ${activityStats.matches.total}
├ Сегодня: ${activityStats.matches.today}
└ За неделю: ${activityStats.matches.week}

🚨 *Жалобы:*
├ Всего: ${activityStats.reports.total}
├ Сегодня: ${activityStats.reports.today}
└ За неделю: ${activityStats.reports.week}

👤 *Активные пользователи сегодня:* ${activityStats.activeToday}
    `.trim();

    await ctx.editMessageText(message, {
      parse_mode: "Markdown",
      reply_markup: ctx.callbackQuery?.message?.reply_markup,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error({ err: errorMessage }, "Ошибка обработки stats_activity");
    await ctx.answerCallbackQuery({ text: "❌ Ошибка загрузки статистики" });
  }
};

export const handleStatsQuick = async (ctx: MyContext) => {
  try {
    const quickStats = await statsService.collectQuickStats();

    const message = `
📈 *БЫСТРАЯ СТАТИСТИКА*

👥 Пользователей: ${quickStats.totalUsers}
✅ Активных: ${quickStats.activeUsers}
🆕 Новых сегодня: ${quickStats.newUsersToday}
❤️ Лайков сегодня: ${quickStats.likesToday}
💑 Метчей сегодня: ${quickStats.matchesToday}

⏱ *Обновлено:* ${new Date().toLocaleTimeString("ru-RU")}
    `.trim();

    await ctx.editMessageText(message, {
      parse_mode: "Markdown",
      reply_markup: ctx.callbackQuery?.message?.reply_markup,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error({ err: errorMessage }, "Ошибка обработки stats_quick");
    await ctx.answerCallbackQuery({ text: "❌ Ошибка загрузки статистики" });
  }
};

export const handleStatsRefresh = async (ctx: MyContext) => {
  await ctx.answerCallbackQuery({ text: "🔄 Обновляем..." });
  await detailedStatsCommand(ctx);
};

export const handleStatsReports = async (ctx: MyContext) => {
  try {
    const activityStats = await statsService.collectActivityStats();

    const message = `
🚨 *СТАТИСТИКА ЖАЛОБ*

📊 Всего жалоб: ${activityStats.reports.total}
📅 Сегодня: ${activityStats.reports.today}
📆 За неделю: ${activityStats.reports.week}

ℹ️ *Для детальной информации по жалобам проверяйте логи бота или базу данных*
    `.trim();

    await ctx.editMessageText(message, {
      parse_mode: "Markdown",
      reply_markup: ctx.callbackQuery?.message?.reply_markup,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error({ err: errorMessage }, "Ошибка обработки stats_reports");
    await ctx.answerCallbackQuery({ text: "❌ Ошибка загрузки статистики" });
  }
};
