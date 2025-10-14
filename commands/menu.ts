import { eq } from "drizzle-orm";
import type { Context } from "grammy";
import { menuCommandKeyboard } from "../keyboards/menuCommandKeyboard";
import { db, likes, matches, users } from "../lib/drizzle";

export const getMenuMessage = async (ctx: Context) => {
  const userId = ctx.from?.id;
  if (!userId) return "Привет, незнакомец!";

  const [existUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId.toString()));
  if (!existUser) return "Привет, незнакомец!";

  const countOfLikes = await db
    .select()
    .from(likes)
    .then((res) => res.length);

  const countOfMatches = await db
    .select()
    .from(matches)
    .then((res) => res.length);

  const countOfProfiles = await db
    .select()
    .from(users)
    .where(eq(users.isVisible, true))
    .then((res) => res.length);

  return `<b>Привет, ${
    existUser.name || "незнакомец"
  }!</>\nГотов к новым знакомствам? 😉\n\n<blockquote>Анкет в боте: ${countOfProfiles}\nВсего метчей: ${countOfMatches}\nВсего лайков: ${countOfLikes}</blockquote>\n\nВыбери нужный пункт меню ниже:`;
};

export const menuCommand = async (ctx: Context) => {
  const message = await getMenuMessage(ctx);
  return ctx.reply(message, {
    reply_markup: menuCommandKeyboard,
    parse_mode: "HTML",
  });
};
