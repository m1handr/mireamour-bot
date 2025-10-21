import type { MyContext } from "..";
import { showMatch } from "../keyboards/showMatch";
import db from "../lib/db";
import { rateProfiles } from "./rateProfiles";
import { showCurrentLike } from "./showCurrentLike";

async function setReaction(ctx: MyContext, type: "like" | "dislike") {
  const userId = ctx.from?.id.toString();
  if (!userId) return;

  const targetId = ctx.session?.currentProfileId;
  if (!targetId)
    return ctx.answerCallbackQuery({ text: "Неизвестная анкета 😅" });

  // Сохраняем реакцию в БД
  await db.like.upsert({
    where: {
      fromUserId_toUserId: {
        fromUserId: userId,
        toUserId: targetId,
      },
    },
    update: { type, createdAt: new Date() },
    create: {
      fromUserId: userId,
      toUserId: targetId,
      type,
    },
  });

  // Проверка на взаимный лайк
  if (type === "like") {
    const mutual = await db.like.findFirst({
      where: {
        fromUserId: targetId,
        toUserId: userId,
        type: "like",
      },
    });

    if (mutual) {
      await db.match.create({
        data: { userAId: userId, userBId: targetId },
      });

      await ctx.api.sendMessage(targetId, "🎉 У вас новый метч!", {
        reply_markup: showMatch,
      });

      await ctx.answerCallbackQuery({ text: "Метч! 💫" });
    } else {
      await ctx.answerCallbackQuery({ text: "Лайк отправлен ❤️" });
    }
  } else {
    await ctx.answerCallbackQuery({ text: "Дизлайк 👎" });
  }

  if (ctx.session.isViewingLikes && ctx.session.likesList?.length) {
    let nextIndex = ctx.session.likesIndex + 1;

    while (nextIndex < ctx.session.likesList.length) {
      const user = ctx.session.likesList[nextIndex];
      const existing = await db.like.findUnique({
        where: {
          fromUserId_toUserId: {
            fromUserId: userId,
            toUserId: user?.id || "",
          },
        },
      });
      if (!existing) break;
      nextIndex++;
    }

    if (nextIndex < ctx.session.likesList.length) {
      ctx.session.likesIndex = nextIndex;
      await showCurrentLike(ctx, nextIndex);
    } else {
      ctx.session.isViewingLikes = false;
      ctx.session.likesIndex = 0;
      await ctx.reply("💌 Все лайки просмотрены! Новых анкет нет.");
    }
  } else {
    await rateProfiles(ctx);
  }
}

export const setLike = (ctx: MyContext) => setReaction(ctx, "like");
export const setDislike = (ctx: MyContext) => setReaction(ctx, "dislike");
