import { autoRetry } from "@grammyjs/auto-retry";
import type { ConversationFlavor } from "@grammyjs/conversations";
import { limit } from "@grammyjs/ratelimiter";
import { run } from "@grammyjs/runner";
import { Bot, type Context, type SessionFlavor, session } from "grammy";
import { commands } from "./commands";
import { dialogs } from "./conversations";
import { handlers } from "./handlers";
import type { Match, University, User } from "./lib/generated/prisma";
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
  SessionFlavor<SessionData> & {
    botConfig: BotConfig;
  };

export interface BotConfig {
  token: string;
  name: University;
  channelId: string;
  channelUsername: string;
  botUsername: string;
  messages: {
    welcome?: string;
  };
  termsUrl: string;
}

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

export class BotFabric {
  private bots: Map<
    string,
    { bot: Bot<MyContext>; runner: ReturnType<typeof run> }
  > = new Map();

  async createBot(config: BotConfig) {
    const bot = new Bot<MyContext>(config.token);

    bot.use(async (ctx, next) => {
      ctx.botConfig = config;
      await next();
    });

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
    this.bots.set(config.name, { bot, runner });

    if (runner.isRunning()) {
      logger.info(`✅ Бот ${config.name} (${bot.botInfo.username}) запущен`);
    }

    return { bot, runner };
  }

  async stopBot(name: string) {
    const botInstance = this.bots.get(name);
    if (botInstance) {
      await botInstance.runner.stop();
      this.bots.delete(name);
      logger.info(`Бот ${name} остановлен`);
    }
  }

  async stopAll() {
    for (const [name, botInstance] of this.bots) {
      await botInstance.runner.stop();
      logger.info(`Бот ${name} остановлен`);
    }
    this.bots.clear();
  }

  getBot(name: string): Bot<MyContext> | undefined {
    return this.bots.get(name)?.bot;
  }
}
