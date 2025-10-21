import { Composer } from "grammy";
import type { MyContext } from "..";
import { deleteUserMessage } from "./deleteUserMessage";
import { errorHandler } from "./errorHandler";

export const middlewares = new Composer<MyContext>();

middlewares.use(errorHandler);
middlewares.use(deleteUserMessage);
