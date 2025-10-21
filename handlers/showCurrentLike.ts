import { InputMediaBuilder } from "grammy";
import type { MyContext } from "..";
import { rateLikesProfilesKeyboard } from "../keyboards/rateLikesProfilesKeyboard";
import { getProfileMessage } from "../utils/getProfileMessage";

export const showCurrentLike = async (ctx: MyContext) => {
  const list = ctx.session.likesList || [];
  const index = ctx.session.likesIndex || 0;

  if (!list.length) return;

  const safeIndex = Math.min(Math.max(index, 0), list.length - 1);
  ctx.session.likesIndex = safeIndex;

  const user = list[safeIndex];
  if (!user) return;
  if (!user.imageUrls?.[0]) return;

  await ctx.editMessageMedia(
    InputMediaBuilder.photo(user.imageUrls[0], {
      caption: getProfileMessage(user, true),
      parse_mode: "HTML",
    }),
  );
  await ctx.editMessageReplyMarkup({
    reply_markup: rateLikesProfilesKeyboard,
  });

  ctx.session.currentProfileId = user.id;
};
