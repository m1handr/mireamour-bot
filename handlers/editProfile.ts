import type { MyContext } from "..";
import { editProfileKeyboard } from "../keyboards/editProfileKeyboard";

export const editProfile = async (ctx: MyContext) => {
  await ctx.editMessageReplyMarkup({
    reply_markup: editProfileKeyboard,
  });
};
