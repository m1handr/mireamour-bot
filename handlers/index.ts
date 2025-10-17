import { Composer } from "grammy";
import type { MyContext } from "..";
import { matches } from "./matches";
import { menu } from "./menu";
import { myProfile } from "./myProfile";
import { disableProfile, enableProfile } from "./toggleProfile";

export const handlers = new Composer<MyContext>();

handlers.callbackQuery("menu", menu);
handlers.callbackQuery("my-profile", myProfile);
handlers.callbackQuery("matches", matches);
handlers.callbackQuery("disable-profile", disableProfile);
handlers.callbackQuery("enable-profile", enableProfile);
