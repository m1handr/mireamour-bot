import { Composer } from "grammy";
import type { MyContext } from "..";
import { deleteUserMessage } from "./deleteUserMessage";

export const middlewares = new Composer<MyContext>();

middlewares.use(deleteUserMessage);
