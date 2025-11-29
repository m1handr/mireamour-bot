import type { MyContext } from "../bot-fabric";
import { backKeyboard } from "../keyboards/backKeyboard";
import db from "../lib/db";
import { removeLastProfileButtons } from "../utils/removeLastProfileButtons";

export const rateProfiles = async (ctx: MyContext) => {
  ctx.session.isViewingLikes = false;
  const userId = ctx.from?.id.toString();
  if (!userId) return;

  await removeLastProfileButtons(ctx);

  const existUser = await db.user.findUnique({
    where: { id: userId },
  });
  if (!existUser) return;

  if (!existUser.imageUrls?.[0])
    return await ctx.editMessageText(
      "Похоже, твоя анкета для знакомства ещё не заполнена 😅\n\n" +
        "Чтобы другие могли тебя найти и познакомиться, нужно её создать ✨",
      {
        reply_markup: backKeyboard,
      }
    );

  if (!existUser.isVisible)
    return await ctx.editMessageText(
      "👀 Чтобы смотреть анкеты других, включи видимость своей профиля в настройках.",
      {
        reply_markup: backKeyboard,
      }
    );

  await ctx.answerCallbackQuery();

  return await ctx.reply(
    `Бот откроется, когда соберется достаточно анкет! Создать анкету можно перейдя по кнопке "Мой профиль" в главном меню. \n\nСледить за обнолевниями можно в нашем ТГК 👇\nhttps://t.me/${ctx.botConfig.channelUsername}`,
    {
      reply_markup: backKeyboard,
    }
  );

  // const profile = await getRandomProfile(
  //   userId,
  //   existUser.gender === "male" ? "female" : "male",
  //   ctx.botConfig.name
  // );

  // if (!profile)
  //   return await ctx.reply(
  //     "Доступные анкеты закончились 😔\n\nЗагляни попозже — кто-нибудь точно появится!",
  //     {
  //       reply_markup: backKeyboard,
  //     }
  //   );

  // if (!profile.imageUrls[0]) return;

  // const sentMessage = await ctx.replyWithPhoto(profile.imageUrls[0], {
  //   caption: getProfileMessage(profile),
  //   parse_mode: "HTML",
  //   reply_markup: rateProfileKeyboard,
  // });

  // await ctx.editMessageReplyMarkup({
  //   reply_markup: rateProfileKeyboard,
  // });

  // ctx.session.currentProfileId = profile.id;
  // ctx.session.lastProfileMessageId = sentMessage.message_id;

  // await ctx.answerCallbackQuery();
};
