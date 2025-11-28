import type { MyContext } from "../bot-fabric";

export const recreateProfile = async (ctx: MyContext) => {
  await ctx.conversation.enter("create-profile");
  await ctx.answerCallbackQuery();
};
