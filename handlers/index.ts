import { Composer } from "grammy";
import type { MyContext } from "..";
import { matches } from "./matches";
import { menu } from "./menu";
import { myProfile } from "./myProfile";

export const handlers = new Composer<MyContext>();

handlers.callbackQuery("menu", menu);
handlers.callbackQuery("my-profile", myProfile);
handlers.callbackQuery("matches", matches);
