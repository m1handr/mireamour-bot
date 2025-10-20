import { autoRetry } from "@grammyjs/auto-retry";
import type { ConversationFlavor } from "@grammyjs/conversations";
import { limit } from "@grammyjs/ratelimiter";
import { run } from "@grammyjs/runner";
import { ArkErrors, type } from "arktype";
import { Bot, type Context, type SessionFlavor, session } from "grammy";
import { commands } from "./commands";
import { dialogs } from "./conversations";
import { handlers } from "./handlers";
import type { Match, User } from "./lib/generated/prisma";
import { middlewares } from "./middlewares";

const envSchema = type({
  TELEGRAM_BOT_TOKEN: "string",
  DATABASE_URL: "string",
});

const validationResult = envSchema(process.env);

if (validationResult instanceof ArkErrors) {
  console.error("❌ Ошибка валидации .env");
  process.exit(1);
}

interface SessionData {
  currentProfileId: string | null;
  lastProfileMessageId: number | null;
  matchesList: (Match & { userA: User; userB: User })[] | null;
  matchesIndex: number;
}

export type MyContext = ConversationFlavor<Context> &
  SessionFlavor<SessionData>;

const bot = new Bot<MyContext>(validationResult.TELEGRAM_BOT_TOKEN);

function initial(): SessionData {
  return {
    currentProfileId: null,
    lastProfileMessageId: null,
    matchesList: [],
    matchesIndex: 0,
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
        "Пожалуйста, воздержитесь от отправки слишком большого количества сообщений!"
      );
    },
  })
);
bot.use(dialogs);

await bot.init();

bot.use(middlewares);
bot.use(commands);
bot.use(handlers);

const runner = run(bot);
if (runner.isRunning()) {
  console.log(`✅ Бот ${bot.botInfo.username} запущен`);
}

const stopRunner = () => runner.isRunning() && runner.stop();
process.once("SIGINT", stopRunner);
process.once("SIGTERM", stopRunner);
