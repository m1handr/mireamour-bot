import type { Context } from "grammy";
import { matchesKeyboard } from "../keyboards/matchesKeyboard";

export const matches = async (ctx: Context) => {
  await ctx.editMessageText("Здесь будут твои метчи, когда они появятся :)", {
    reply_markup: matchesKeyboard,
  });
  await ctx.answerCallbackQuery();
};
