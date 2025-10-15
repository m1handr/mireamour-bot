import type { MyContext } from "..";
import { matchesKeyboard } from "../keyboards/matchesKeyboard";

export const matches = async (ctx: MyContext) => {
  await ctx.editMessageText("Здесь будут твои метчи, когда они появятся :)", {
    reply_markup: matchesKeyboard,
  });
  await ctx.answerCallbackQuery();
};
