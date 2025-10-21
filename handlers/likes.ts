import type { MyContext } from "..";
import { getUsersWhoLikedMe } from "../utils/getUsersWhoLikedMe";
import { showCurrentLike } from "./showCurrentLike";

export const likes = async (ctx: MyContext) => {
  const userId = ctx.from?.id.toString();
  if (!userId) return;

  const users = await getUsersWhoLikedMe(userId);
  if (!users.length) {
    return ctx.reply("💌 Пока никто не ставил тебе лайк");
  }

  ctx.session.likesList = users;
  ctx.session.likesIndex = 0;

  await showCurrentLike(ctx);
};
