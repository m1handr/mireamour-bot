import type { MyContext } from "..";
import db from "../lib/db";

export const getMenuMessage = async (ctx: MyContext) => {
  const userId = ctx.from?.id;
  if (!userId) return "Привет, незнакомец!";

  const existUser = await db.user.findUnique({
    where: {
      id: userId.toString(),
    },
  });
  if (!existUser) return "Привет, незнакомец!";

  const countOfLikes = await db.like.count({
    where: {
      type: "like",
    },
  });
  const countOfMatches = await db.match.count();

  const countOfProfiles = await db.user.count({
    where: {
      isVisible: true,
    },
  });

  return `<b>Привет, ${
    existUser.name || "незнакомец"
  }!</>\n\n<blockquote>Анкет в боте: ${countOfProfiles}\nВсего метчей: ${countOfMatches}\nВсего лайков: ${countOfLikes}</blockquote>\n\nВыбери нужный пункт меню ниже:`;
};
