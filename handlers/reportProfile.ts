import type { MyContext } from "..";
import { reportReasonKeyboard } from "../keyboards/reportReasonKeyboard";
import db from "../lib/db";
import { notifyAdminAboutReport } from "../utils/notifyAdminAboutReport";
import { setDislike } from "./handleLike";

const reasonsMap: Record<string, string> = {
  "report-reason-spam": "Спам",
  "report-reason-bad": "Неадекват",
  "report-reason-photo": "Неподходящее фото",
  "report-reason-abuse": "Оскорбления",
  "report-reason-fake": "Фейковый профиль",
  "report-reason-scam": "Мошенничество / просьбы о деньгах",
  "report-reason-explicit": "Неприемлемый контент",
};

export const reportProfile = async (ctx: MyContext) => {
  ctx.editMessageReplyMarkup({
    reply_markup: reportReasonKeyboard,
  });
};

export const reportReason = async (ctx: MyContext) => {
  const reporterId = ctx.from?.id?.toString();
  const targetId = ctx.session?.currentProfileId;
  const callbackData = ctx.callbackQuery?.data;

  if (!reporterId || !targetId || !callbackData) {
    return ctx.answerCallbackQuery({ text: "Ошибка 😅" });
  }

  const reason = reasonsMap[callbackData];
  if (!reason) {
    return ctx.answerCallbackQuery({ text: "Неизвестная причина 😅" });
  }

  await db.report.create({
    data: { fromUserId: reporterId, toUserId: targetId, reason },
  });

  await ctx.answerCallbackQuery({
    text: `🙏 Спасибо! Жалоба (${reason}) успешно отправлена.`,
  });

  await notifyAdminAboutReport(ctx, targetId, reporterId, reason);

  await setDislike(ctx);
};
