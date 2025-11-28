import { InputMediaBuilder } from "grammy";
import type { MyContext } from "../bot-fabric";
import { rateLikesProfilesKeyboard } from "../keyboards/rateLikesProfilesKeyboard";
import db from "../lib/db";
import { getProfileMessage } from "../utils/getProfileMessage";

export const showCurrentLike = async (ctx: MyContext, userIndex?: number) => {
  const list = ctx.session.likesList || [];
  if (!list.length) return;

  const userId = ctx.from?.id.toString();
  if (!userId) return;

  const index = userIndex ?? ctx.session.likesIndex ?? 0;
  const safeIndex = Math.min(Math.max(index, 0), list.length - 1);
  ctx.session.likesIndex = safeIndex;

  const user = list[safeIndex];
  if (!user) return;
  if (!user.imageUrls?.[0]) return;

  const existing = await db.like.findUnique({
    where: {
      fromUserId_toUserId: {
        fromUserId: userId,
        toUserId: user.id,
      },
    },
  });
  const alreadyRated = !!existing;

  const keyboard = rateLikesProfilesKeyboard(alreadyRated);

  await ctx.editMessageMedia(
    InputMediaBuilder.photo(user.imageUrls[0], {
      caption: getProfileMessage(user, true),
      parse_mode: "HTML",
    })
  );

  await ctx.editMessageReplyMarkup({
    reply_markup: keyboard,
  });

  ctx.session.currentProfileId = user.id;
};
