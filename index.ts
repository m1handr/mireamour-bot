import { autoRetry } from "@grammyjs/auto-retry";
import { limit } from "@grammyjs/ratelimiter";
import { run } from "@grammyjs/runner";
import { ArkErrors, type } from "arktype";
import { Bot } from "grammy";
import { commands } from "./commands";
import { handlers } from "./handlers";
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

const bot = new Bot(validationResult.TELEGRAM_BOT_TOKEN);

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
