import { autoRetry } from "@grammyjs/auto-retry";
import type { ConversationFlavor } from "@grammyjs/conversations";
import { limit } from "@grammyjs/ratelimiter";
import { run } from "@grammyjs/runner";
import { Bot, type Context, type SessionFlavor, session } from "grammy";
import { commands } from "./commands";
import { dialogs } from "./conversations";
import { handlers } from "./handlers";
import db from "./lib/db";
import { config } from "./lib/env";
import type { Match, User } from "./lib/generated/prisma";
import { logger } from "./lib/logger";
import { middlewares } from "./middlewares";

interface SessionData {
  currentProfileId: string | null;
  lastProfileMessageId: number | null;
  matchesList: (Match & { userA: User; userB: User })[] | null;
  matchesIndex: number;
  likesList: (User | null)[] | null;
  likesIndex: number;
  isViewingLikes: boolean;
}

export type MyContext = ConversationFlavor<Context> &
  SessionFlavor<SessionData>;

const bot = new Bot<MyContext>(config.TELEGRAM_BOT_TOKEN);

function initial(): SessionData {
  return {
    currentProfileId: null,
    lastProfileMessageId: null,
    matchesList: [],
    matchesIndex: 0,
    likesList: [],
    likesIndex: 0,
    isViewingLikes: false,
  };
}
bot.use(session({ initial }));

bot.api.config.use(autoRetry());
bot.use(
  limit({
    timeFrame: 2000,
    limit: 3,
    onLimitExceeded: async (ctx) => {
      await ctx.reply(
        "Пожалуйста, воздержитесь от отправки слишком большого количества сообщений!",
      );
    },
  }),
);

bot.use(dialogs);
await bot.init();
bot.use(middlewares);
bot.use(commands);
bot.use(handlers);

const runner = run(bot);
if (runner.isRunning()) {
  logger.info(`✅ Бот ${bot.botInfo.username} запущен`);
}

const gracefulShutdown = async (signal: string) => {
  logger.info(`Получен сигнал ${signal}, завершаем работу...`);

  try {
    await runner.stop();
    logger.info("Runner остановлен");
  } catch (error) {
    logger.error({ err: error }, "Ошибка при остановке runner");
  }

  try {
    await db.$disconnect();
    logger.info("База данных отключена");
  } catch (error) {
    logger.error({ err: error }, "Ошибка при отключении от БД");
  }

  logger.info("Бот успешно остановлен");
  process.exit(0);
};

process.once("SIGINT", () => gracefulShutdown("SIGINT"));
process.once("SIGTERM", () => gracefulShutdown("SIGTERM"));
