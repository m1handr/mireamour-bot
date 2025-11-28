import { Composer } from "grammy";
import type { MyContext } from "../bot-fabric";
import { checkUniversity } from "./checkUniversity";
import { deleteUserMessage } from "./deleteUserMessage";
import { errorHandler } from "./errorHandler";

export const middlewares = new Composer<MyContext>();

middlewares.use(errorHandler);
middlewares.use(deleteUserMessage);
middlewares.use(checkUniversity);
