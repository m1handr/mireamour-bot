import { Conversation } from "@grammyjs/conversations";
import type { Context } from "grammy";

export const createProfile = async (conv: Conversation, ctx: Context) => {
  let age: number | null = null;
  let imageUrls: string[] | null = null;

  while (age === null) {
    await ctx.reply("Сколько тебе лет? 🎂");

    const input = await conv.form.text();
    const parsed = parseInt(input, 10);

    if (!isNaN(parsed) && parsed >= 18 && parsed <= 30) {
      age = parsed;
    } else {
      await ctx.reply("❌ Неверное значение. Возраст должен быть от 18 до 30.");
    }
  }

  while (!imageUrls) {
    await ctx.reply("Теперь отправь свою фотогрфию 📸");

    const input = await conv.form.photo();

    if (input) {
      // TODO: сделать загрузку изображения в профиль
    }
  }

  await ctx.reply(`Отлично! Тебе ${age} лет.`);
};
