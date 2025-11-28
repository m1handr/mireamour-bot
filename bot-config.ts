import type { BotConfig } from "./bot-fabric";
import { config } from "./lib/env";

export const botsConfig: BotConfig[] = [
  {
    token: config.MIREA_BOT_TOKEN,
    channelId: config.MIREA_CHANNEL_ID,
    channelUsername: config.MIREA_CHANNEL_USERNAME,
    name: "mirea",
    botUsername: "mireamour_bot",
    messages: {
      welcome: "Это <b>МИРЭАмур</b> — бот для знакомств студентов МИРЭА.",
    },
    termsUrl: "https://telegra.ph/MIREHAmur--Usloviya-10-12",
  },
  {
    token: config.MIIT_BOT_TOKEN,
    channelId: config.MIIT_CHANNEL_ID,
    channelUsername: config.MIIT_CHANNEL_USERNAME,
    name: "miit",
    botUsername: "miityou_bot",
    messages: {
      welcome: "Это <b>МИИТYou</b> — бот для знакомств студентов МИИТ.",
    },
    termsUrl: "https://telegra.ph/MIITYou--Usloviya-11-28",
  },
];
