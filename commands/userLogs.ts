import type { MyContext } from "../bot-fabric";
import db from "../lib/db";
import { config } from "../lib/env";

export const userLogsCommand = async (ctx: MyContext) => {
  if (ctx.from?.id.toString() !== config.ADMIN_CHAT_ID) return;

  const params = ctx.message?.text?.split(" ") || [];
  const targetUserId = params[1];

  if (!targetUserId) {
    await ctx.reply(
      "Использование: /userlogs [user_id]\n\n" + "Пример: /userlogs 123456789 5"
    );
    return;
  }

  try {
    const user = await db.user.findUnique({
      where: { id: targetUserId },
    });

    if (!user) {
      await ctx.reply("❌ Пользователь не найден");
      return;
    }

    const userInfo = `
👤 <b>Информация о пользователе:</b>
├ ID: ${targetUserId}
├ Имя: ${user.name || "Не указано"}
├ Username: ${user.username ? `@${user.username}` : "Не указан"}
├ Видимый: ${user.isVisible ? "✅" : "❌"}
└ Зарегистрирован: ${user.createdAt.toLocaleString("ru-RU")}

<b>Для просмотра логов необходимо настроить систему хранения логов в БД.</b>
    `.trim();

    if (user.imageUrls[0]) {
      await ctx.replyWithPhoto(user.imageUrls[0], {
        caption: userInfo,
        parse_mode: "HTML",
      });
    } else {
      await ctx.reply(userInfo, {
        parse_mode: "HTML",
      });
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    await ctx.reply(`❌ Ошибка при получении информации: ${errorMessage}`);
  }
};

export const findUserCommand = async (ctx: MyContext) => {
  if (ctx.from?.id.toString() !== config.ADMIN_CHAT_ID) return;

  const query = ctx.message?.text?.split(" ").slice(1).join(" ");
  if (!query) {
    await ctx.reply(
      "Использование: /finduser <имя или username>\n\n" +
        "Пример: /finduser Ivan\n" +
        "Пример: /finduser @username"
    );
    return;
  }

  try {
    const searchTerm = query.replace("@", "");

    const users = await db.user.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { username: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        isVisible: true,
        createdAt: true,
      },
      take: 10,
    });

    if (users.length === 0) {
      await ctx.reply("❌ Пользователи не найдены");
      return;
    }

    const usersList = users
      .map(
        (user) =>
          `├ ${user.name || "Без имени"} (${
            user.username ? `@${user.username}` : "нет username"
          }) - ID: ${user.id}`
      )
      .join("\n");

    const message = `
👥 <b>Найденные пользователи:</b> (${users.length})

${usersList}

<b>Для просмотра логов используйте:</b> /userlogs [id]
    `.trim();

    await ctx.reply(message, {
      parse_mode: "HTML",
      link_preview_options: { is_disabled: true },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    await ctx.reply(`❌ Ошибка при поиске: ${errorMessage}`);
  }
};
