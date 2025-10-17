import type { MyContext } from "..";
import { matchesKeyboard } from "../keyboards/matchesKeyboard";
import db from "../lib/db";

export const matches = async (ctx: MyContext) => {
  const userId = ctx.from?.id.toString();

  const userMatches = await db.match.findMany({
    where: {
      OR: [{ userAId: userId }, { userBId: userId }],
    },
    include: {
      userA: true,
      userB: true,
    },
  });

  if (userMatches.length === 0) {
    await ctx.editMessageText("💫 Пока у тебя нет метчей", {
      reply_markup: matchesKeyboard,
    });
    return ctx.answerCallbackQuery();
  }

  const matchList = userMatches
    .map((m) => {
      const matchUser = m.userAId === userId ? m.userB : m.userA;
      return `• ${matchUser?.name ?? "Без имени"}`;
    })
    .join("\n");

  const text =
    `💞 Твои метчи:\n\n${matchList}\n\n` +
    "Пиши первыми — кто знает, к чему это приведёт 😉";

  await ctx.editMessageText(text, {
    reply_markup: matchesKeyboard,
  });

  await ctx.answerCallbackQuery();
};
