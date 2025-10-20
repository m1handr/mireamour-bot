import type { MyContext } from "..";
import db from "../lib/db";
import { rateProfiles } from "./rateProfiles";

async function setReaction(ctx: MyContext, type: "like" | "dislike") {
  const userId = ctx.from?.id.toString();
  if (!userId) return;

  const targetId = ctx.session?.currentProfileId;
  if (!targetId)
    return ctx.answerCallbackQuery({ text: "Неизвестная анкета 😅" });

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

      await ctx.api.sendMessage(
        targetId,
        `🎉 У вас взаимная симпатия с ${
          ctx.callbackQuery?.message?.chat?.first_name || "новым пользователем"
        }!`,
      );

      await ctx.answerCallbackQuery({ text: "Совпадение! 💫" });
    } else {
      await ctx.answerCallbackQuery({ text: "Лайк отправлен ❤️" });
    }
  } else {
    await ctx.answerCallbackQuery({ text: "Дизлайк 👎" });
  }

  await rateProfiles(ctx);
  await ctx.answerCallbackQuery();
}

// Теперь просто делаем обёртки для удобства
export const setLike = (ctx: MyContext) => setReaction(ctx, "like");
export const setDislike = (ctx: MyContext) => setReaction(ctx, "dislike");
