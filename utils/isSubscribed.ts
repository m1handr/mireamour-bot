import type { MyContext } from "../bot-fabric";

export const isSubscribed = async (ctx: MyContext) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  try {
    const member = await ctx.api.getChatMember(ctx.botConfig.channelId, userId);

    if (
      member.status === "left" ||
      member.status === "kicked" ||
      member.status === "restricted"
    ) {
      await ctx.reply(
        "📢 Чтобы пользоваться ботом, нужно быть подписанным на наш канал!\n\n" +
          "Мы публикуем там важные новости и обновления ❤️",
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🔗 Перейти к каналу",
                  url: `https://t.me/${ctx.botConfig.channelUsername}`,
                },
              ],
              [{ text: "✅ Проверить подписку", callback_data: "check-sub" }],
            ],
          },
        }
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Ошибка проверки подписки:", error);
    return ctx.reply("Ошибка проверки подписки 😔");
  }
};
