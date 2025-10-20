import type { MyContext } from "..";

export const removeLastProfileButtons = async (ctx: MyContext) => {
  const userId = ctx.from?.id.toString();
  if (!userId) return;

  if (ctx.session.lastProfileMessageId) {
    try {
      await ctx.api.editMessageReplyMarkup(
        userId,
        ctx.session.lastProfileMessageId,
        { reply_markup: undefined },
      );
      ctx.session.lastProfileMessageId = null;
    } catch {}
  }
};
