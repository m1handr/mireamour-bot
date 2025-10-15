import { conversations, createConversation } from "@grammyjs/conversations";
import { Composer } from "grammy";
import type { MyContext } from "..";
import { createProfile } from "./createProfile";

export const dialogs = new Composer<MyContext>();

dialogs.use(conversations());
dialogs.use(createConversation(createProfile, "create-profile"));
