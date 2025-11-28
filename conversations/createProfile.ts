import type { Conversation } from "@grammyjs/conversations";
import { randomUUID } from "node:crypto";
import type { MyContext } from "../bot-fabric";
import { menuCommand } from "../commands/menu";
import { profileCreatedKeyboard } from "../keyboards/profileCreatedKeyboard";
import db from "../lib/db";
import type { Gender } from "../lib/generated/prisma";
import { S3_BUCKET_NAME, S3_ENDPOINT, s3 } from "../lib/s3";
import { optimizeImage } from "../utils/optimizeImage";

export const createProfile = async (
  conv: Conversation<MyContext>,
  ctx: MyContext
) => {
  let age: number | null = null;
  let gender: Gender | null = null;
  let description: string | null = null;
  let imageUrls: string[] | null = null;

  await ctx.reply("🎂 *Сколько тебе лет?*\n\n_Введи число от 18 до 30_", {
    parse_mode: "Markdown",
  });

  while (age === null) {
    const input = await conv.form.text();
    const parsed = parseInt(input, 10);

    if (!Number.isNaN(parsed) && parsed >= 18 && parsed <= 30) {
      age = parsed;
    } else {
      await ctx.reply("❌ Возраст должен быть от 18 до 30. Попробуй еще раз.", {
        parse_mode: "Markdown",
      });
    }
  }

  await ctx.reply("👫 *Выбери свой пол:*", {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "👩 Девушка", callback_data: "gender-female" },
          { text: "👨 Парень", callback_data: "gender-male" },
        ],
      ],
    },
  });

  while (gender === null) {
    const cb = await conv.waitFor("callback_query:data");
    switch (cb.callbackQuery.data) {
      case "gender-female":
        gender = "female";
        break;
      case "gender-male":
        gender = "male";
        break;
      default:
        await cb.reply("❌ Неверный выбор. Попробуй ещё раз.");
        continue;
    }
    await cb.answerCallbackQuery();
  }

  await ctx.reply(
    "📝 *Расскажи о себе*\n\n_Можно написать о своих интересах, увлечениях или чем ты занимаешься. Не более 500 символов._",
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "⏭ Пропустить", callback_data: "skip_description" }],
        ],
      },
    }
  );

  let descriptionSet = false;
  while (!descriptionSet) {
    const descResponse = await conv.wait();

    if (descResponse.update.callback_query?.data === "skip_description") {
      await descResponse.answerCallbackQuery();
      description = null;
      descriptionSet = true;
      await ctx.reply("✅ Описание пропущено");
    } else if (descResponse.message && "text" in descResponse.message) {
      const text = descResponse.message.text;
      if (!text)
        return ctx.reply(
          "❌ Не удалось получить текст сообщения. Попробуй ещё раз."
        );

      if (text.length > 500) {
        await ctx.reply(
          `❌ *Слишком длинное описание*\n\nТвое описание содержит ${text.length} символов, что превышает лимит в 500 символов. Сократи его и отправь снова.`,
          {
            parse_mode: "Markdown",
          }
        );
      } else {
        description = text;
        descriptionSet = true;
        await ctx.reply(
          `✅ *Описание сохранено!* ${text.length}/500 символов`,
          {
            parse_mode: "Markdown",
          }
        );
      }
    } else {
      await ctx.reply(
        "❌ Пожалуйста, отправь текстовое сообщение или нажми 'Пропустить'"
      );
    }
  }

  await ctx.reply(
    "📸 *Теперь отправь свою фотографию*\n\n_Лучше всего подойдет твое настоящее фото — так больше шансов найти интересных собеседников_",
    {
      parse_mode: "Markdown",
    }
  );

  while (!imageUrls) {
    const photoMsg = await conv.waitFor(":photo", {
      otherwise: (ctx) => ctx.reply("❌ Пожалуйста, отправь фотографию!"),
    });

    const photo = photoMsg.message?.photo?.at(-1);
    if (!photo) {
      await ctx.reply("❌ Не удалось получить фото. Попробуй ещё раз.");
      continue;
    }

    const fileInfo = await ctx.api.getFile(photo.file_id);
    const fileUrl = `https://api.telegram.org/file/bot${ctx.api.token}/${fileInfo.file_path}`;

    const response = await fetch(fileUrl);
    const buffer = Buffer.from(await response.arrayBuffer());

    const optimizedImageBuffer = await optimizeImage(buffer);
    const key = `profiles/${ctx.from?.id}/${randomUUID()}.webp`;

    await s3.write(key, optimizedImageBuffer);

    imageUrls = [`${S3_ENDPOINT}/${S3_BUCKET_NAME}/${key}`];
  }

  await db.user.update({
    where: { id: ctx.from?.id.toString() },
    data: {
      age,
      gender,
      description,
      imageUrls,
      isVisible: true,
    },
  });

  const genderText = gender === "female" ? "👩 Девушка" : "👨 Парень";
  const descriptionPreview = description
    ? `${description.substring(0, 100)}${description.length > 100 ? "..." : ""}`
    : "не указано";

  await ctx.reply(
    `🎉 *Отлично! Твоя анкета создана!*\n\n` +
      `*Возраст:* ${age}\n` +
      `*Пол:* ${genderText}\n` +
      `*Описание:* ${descriptionPreview}\n\n` +
      `Теперь можно пользоваться ботом в полном объеме! ✨`,
    { parse_mode: "Markdown", reply_markup: profileCreatedKeyboard }
  );

  await menuCommand(ctx);
};
