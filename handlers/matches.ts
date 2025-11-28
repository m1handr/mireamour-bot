import type { MyContext } from "../bot-fabric";
import { backKeyboard } from "../keyboards/backKeyboard";
import db from "../lib/db";
import { showCurrentMatch } from "./showCurrentMatch";

export const matches = async (ctx: MyContext) => {
  const userId = ctx.from?.id.toString();
  if (!userId) return;

  const userMatches = await db.match.findMany({
    where: { OR: [{ userAId: userId }, { userBId: userId }] },
    include: { userA: true, userB: true },
    orderBy: { createdAt: "desc" },
  });

  ctx.session.matchesList = userMatches;
  ctx.session.matchesIndex = 0;

  if (userMatches.length === 0) {
    await ctx.editMessageText("💫 Пока у тебя нет метчей", {
      reply_markup: backKeyboard,
    });
    return ctx.answerCallbackQuery();
  }

  await showCurrentMatch(ctx);
};
