import { InputMediaBuilder } from "grammy";
import type { MyContext } from "..";
import { backKeyboard } from "../keyboards/backKeyboard";
import { matchesKeyboard } from "../keyboards/matchesKeyboard";
import { getProfileMessage } from "../utils/getProfileMessage";

export async function showCurrentMatch(ctx: MyContext) {
  const matchesList = ctx.session.matchesList;
  const index = ctx.session.matchesIndex;
  const userId = ctx.from?.id.toString();

  if (!matchesList || matchesList.length === 0) {
    await ctx.editMessageText("💫 У тебя пока нет матчей", {
      reply_markup: undefined,
    });
    return;
  }

  const safeIndex = Math.min(Math.max(index, 0), matchesList.length - 1);
  ctx.session.matchesIndex = safeIndex;

  const currentMatch = matchesList[safeIndex];
  if (!currentMatch) return;

  const matchUser =
    currentMatch.userA.id === userId ? currentMatch.userB : currentMatch.userA;

  if (!matchUser.imageUrls?.[0]) return;

  await ctx.editMessageMedia(
    InputMediaBuilder.photo(matchUser.imageUrls[0], {
      caption: getProfileMessage(matchUser, true),
      parse_mode: "HTML",
    }),
  );
  await ctx.editMessageReplyMarkup({
    reply_markup: matchesList.length > 1 ? matchesKeyboard : backKeyboard,
  });

  await ctx.answerCallbackQuery();
}
