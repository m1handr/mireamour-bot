import { Composer } from "grammy";
import type { MyContext } from "..";
import { banUser } from "./banUser";
import { setDislike, setLike } from "./handleLike";
import { matches } from "./matches";
import { menu } from "./menu";
import { myProfile } from "./myProfile";
import { rateProfiles } from "./rateProfiles";
import { recreateProfile } from "./recreateProfile";
import { reportProfile, reportReason } from "./reportProfile";
import { showCurrentMatch } from "./showCurrentMatch";
import { disableProfile, enableProfile } from "./toggleProfile";

export const handlers = new Composer<MyContext>();

handlers.callbackQuery("menu", menu);
handlers.callbackQuery("my-profile", myProfile);
handlers.callbackQuery("matches", matches);
handlers.callbackQuery("recreate-profile", recreateProfile);
handlers.callbackQuery("disable-profile", disableProfile);
handlers.callbackQuery("enable-profile", enableProfile);
handlers.callbackQuery("rate-profiles", rateProfiles);
handlers.callbackQuery("like-profile", setLike);
handlers.callbackQuery("dislike-profile", setDislike);
handlers.callbackQuery("report-profile", reportProfile);
handlers.callbackQuery(/report-reason-.+/, reportReason);
handlers.callbackQuery(/^ban-user-(.+)$/, async (ctx: MyContext) => {
  const targetId = ctx.match?.[1];
  if (!targetId) return ctx.answerCallbackQuery({ text: "Ошибка 😅" });

  await banUser(ctx, targetId);
});

handlers.callbackQuery("matches-next", async (ctx) => {
  if (!ctx.session.matchesList?.length) return;

  const len = ctx.session.matchesList.length;
  ctx.session.matchesIndex = (ctx.session.matchesIndex + 1) % len;

  await showCurrentMatch(ctx);
});

handlers.callbackQuery("matches-prev", async (ctx) => {
  if (!ctx.session.matchesList?.length) return;

  const len = ctx.session.matchesList.length;
  ctx.session.matchesIndex = (ctx.session.matchesIndex - 1 + len) % len;

  await showCurrentMatch(ctx);
});
