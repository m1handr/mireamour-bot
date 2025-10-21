import type { MyContext } from "..";

export const isSubscribed = async (ctx: MyContext) => {
  const channelId = process.env.CHANNEL_ID;
  const userId = ctx.from?.id;

  if (!channelId || !userId) return;

  try {
    const member = await ctx.api.getChatMember(channelId, userId);

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
                  url: `https://t.me/${process.env.CHANNEL_USERNAME}`,
                },
              ],
              [{ text: "✅ Проверить подписку", callback_data: "check-sub" }],
            ],
          },
        },
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Ошибка проверки подписки:", error);
    return ctx.reply("Ошибка проверки подписки 😔");
  }
};
