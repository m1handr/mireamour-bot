import { Composer } from "grammy";
import type { MyContext } from "..";
import { banUser } from "./banUser";
import { checkSubCallback } from "./checkSubCallback";
import { setDislike, setLike } from "./handleLike";
import { likes } from "./likes";
import { matches } from "./matches";
import { menu } from "./menu";
import { myProfile } from "./myProfile";
import { rateProfiles } from "./rateProfiles";
import { recreateProfile } from "./recreateProfile";
import { reportProfile, reportReason } from "./reportProfile";
import { showCurrentLike } from "./showCurrentLike";
import { showCurrentMatch } from "./showCurrentMatch";
import { disableProfile, enableProfile } from "./toggleProfile";

export const handlers = new Composer<MyContext>();

handlers.callbackQuery("menu", menu);
handlers.callbackQuery("check-sub", checkSubCallback);
handlers.callbackQuery("my-profile", myProfile);
handlers.callbackQuery("matches", matches);
handlers.callbackQuery("likes", likes);
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

handlers.callbackQuery("likes-prev", async (ctx) => {
  if (!ctx.session.likesList?.length) return;

  const len = ctx.session.likesList.length;
  ctx.session.likesIndex = (ctx.session.likesIndex - 1 + len) % len;
  await showCurrentLike(ctx);
});

handlers.callbackQuery("likes-next", async (ctx) => {
  if (!ctx.session.likesList?.length) return;

  ctx.session.likesIndex =
    (ctx.session.likesIndex + 1) % ctx.session.likesList.length;
  await showCurrentLike(ctx);
});
