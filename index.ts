import { botsConfig } from "./bot-config";
import { BotFabric } from "./bot-fabric";
import db from "./lib/db";
import { logger } from "./lib/logger";

const botManager = new BotFabric();

async function startAllBots() {
  for (const config of botsConfig) {
    try {
      await botManager.createBot(config);
    } catch (error) {
      logger.error({ err: error }, `Ошибка при запуске бота ${config.name}`);
    }
  }
}

const gracefulShutdown = async (signal: string) => {
  logger.info(`Получен сигнал ${signal}, завершаем работу...`);

  try {
    await botManager.stopAll();
    logger.info("Все боты остановлены");
  } catch (error) {
    logger.error({ err: error }, "Ошибка при остановке ботов");
  }

  try {
    await db.$disconnect();
    logger.info("База данных отключена");
  } catch (error) {
    logger.error({ err: error }, "Ошибка при отключении от БД");
  }

  logger.info("Все боты успешно остановлены");
  process.exit(0);
};

startAllBots();

process.once("SIGINT", () => gracefulShutdown("SIGINT"));
process.once("SIGTERM", () => gracefulShutdown("SIGTERM"));
