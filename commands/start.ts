import type { MyContext } from "..";
import { startCommandKeyboard } from "../keyboards/startCommandKeyboard";
import db from "../lib/db";

const helloStickers = [
  "CAACAgIAAxkBAAOyaOwLLdPBKt5t_dj0y0CamKNhIvEAAokCAAJWnb0KoVbNAiEyDj02BA",
  "CAACAgIAAxkBAAO0aOwLU9PZbpppcmApfIa82SeRXJIAAnsAA8GcYAzbGh-2HVQ2iDYE",
  "CAACAgIAAxkBAAO2aOwLZltA_HHsJ-70dJAJ-_hOIL0AAkgAA1KJkSNu2S6onD1PAAE2BA",
];

export const startCommand = async (ctx: MyContext) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  const existUser = await db.user.findUnique({
    where: {
      id: userId.toString(),
    },
  });

  if (!existUser) {
    await db.user.create({
      data: {
        id: userId.toString(),
        name: ctx.from?.first_name,
      },
    });
  }

  const randomSticker =
    helloStickers[Math.floor(Math.random() * helloStickers.length)];
  if (randomSticker) await ctx.replyWithSticker(randomSticker);
  return ctx.reply(
    `<b>Привет, ${ctx.from?.first_name || "незнакомец"}! 👋</b>\n
Это <b>МИРЭАмур</b> — бот для знакомств студентов МИРЭА.\n
<blockquote>Продолжая, ты соглашаешься с нашими <a href="https://telegra.ph/MIREHAmur--Usloviya-10-12">условиями</a></blockquote>\n
<b>НАЧНЕМ? 👇</b>`,
    {
      parse_mode: "HTML",
      link_preview_options: { is_disabled: true },
      reply_markup: startCommandKeyboard,
    },
  );
};
