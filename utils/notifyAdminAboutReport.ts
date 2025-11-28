import { InlineKeyboard } from "grammy";
import type { MyContext } from "../bot-fabric";
import db from "../lib/db";
import { config } from "../lib/env";
import { getProfileMessage } from "./getProfileMessage";

export async function notifyAdminAboutReport(
  ctx: MyContext,
  targetId: string,
  reporterId: string,
  reason: string
) {
  const targetUser = await db.user.findUnique({
    where: { id: targetId },
  });
  if (!targetUser) return;

  const reporterUser = await db.user.findUnique({
    where: { id: reporterId },
  });

  const targetLink = targetUser.username
    ? `@${targetUser.username}`
    : `ID: ${targetUser.id}`;
  const reporterLink = reporterUser?.username
    ? `@${reporterUser.username}`
    : `ID: ${reporterId}`;

  const keyboard = new InlineKeyboard().text(
    "🚫 Заблокировать пользователя",
    `ban-user-${targetId}`
  );

  const profileText = getProfileMessage(targetUser);

  const reportText =
    `⚠️ Поступила жалоба на пользователя: ${targetLink}\n\n` +
    `Причина: ${reason}\n` +
    `От пользователя: ${reporterLink}`;

  const text = `${profileText}\n\n${reportText}`;

  if (targetUser.imageUrls?.[0]) {
    await ctx.api.sendPhoto(config.ADMIN_CHAT_ID, targetUser.imageUrls[0], {
      caption: text,
      parse_mode: "HTML",
      reply_markup: keyboard,
    });
  } else {
    await ctx.api.sendMessage(config.ADMIN_CHAT_ID, text, {
      parse_mode: "HTML",
      reply_markup: keyboard,
    });
  }
}
