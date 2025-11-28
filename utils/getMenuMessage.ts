import type { MyContext } from "../bot-fabric";
import db from "../lib/db";
import type { University } from "../lib/generated/prisma";

export const getMenuMessage = async (
  ctx: MyContext,
  university: University
) => {
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
      fromUser: {
        university,
      },
      toUser: {
        university,
      },
    },
  });

  const countOfMatches = await db.match.count({
    where: {
      userA: {
        university,
      },
      userB: {
        university,
      },
    },
  });

  const countOfProfiles = await db.user.count({
    where: {
      isVisible: true,
      university,
    },
  });

  return `<b>Привет, ${
    existUser.name || "незнакомец"
  }!</>\n\n<blockquote>Анкет в боте: ${countOfProfiles}\nВсего метчей: ${countOfMatches}\nВсего лайков: ${countOfLikes}</blockquote>\n\nВыбери нужный пункт меню ниже:`;
};
