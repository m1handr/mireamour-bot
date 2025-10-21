import type { MyContext } from "..";
import { menu } from "./menu";

export const checkSubCallback = async (ctx: MyContext) => {
  const channelId = process.env.CHANNEL_ID;
  const userId = ctx.from?.id;
  if (!channelId || !userId) return;

  const member = await ctx.api.getChatMember(channelId, userId);

  if (
    member.status === "left" ||
    member.status === "kicked" ||
    member.status === "restricted"
  ) {
    await ctx.answerCallbackQuery({
      text: "😕 Вы ещё не подписались!",
      show_alert: true,
    });
  } else {
    await ctx.answerCallbackQuery({
      text: "🎉 Спасибо за подписку! Теперь можно пользоваться ботом.",
      show_alert: true,
    });

    await menu(ctx);
  }
};
