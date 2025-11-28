import type { MyContext } from "../bot-fabric";
import { config } from "../lib/env";
import { logger } from "../lib/logger";

export const errorHandler = async (
  ctx: MyContext,
  next: () => Promise<void>
) => {
  try {
    await next();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Неизвестная ошибка";
    const stack = error instanceof Error ? error.stack : undefined;

    logger.error(
      {
        err: error,
        stack,
        userId: ctx.from?.id,
      },
      `Ошибка в обработчике для пользователя ${ctx.from?.id}`
    );

    try {
      await ctx.reply("😔 Произошла непредвиденная ошибка");
    } catch (replyError) {
      logger.error(replyError, "Не удалось отправить сообщение об ошибке");
    }

    if (config.ADMIN_CHAT_ID) {
      try {
        await ctx.api.sendMessage(
          config.ADMIN_CHAT_ID,
          `🚨 Критическая ошибка у пользователя ${ctx.from?.id}:\n${errorMessage}`
        );
      } catch (adminError) {
        logger.error(adminError, "Не удалось уведомить админа");
      }
    }
  }
};
