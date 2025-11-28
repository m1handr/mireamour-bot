import { conversations, createConversation } from "@grammyjs/conversations";
import { Composer } from "grammy";
import type { MyContext } from "../bot-fabric";
import { createProfile } from "./createProfile";

export const dialogs = new Composer<MyContext>();

dialogs.use(conversations());
dialogs.use(createConversation(createProfile as any, "create-profile"));
