import { Composer } from "grammy";
import { deleteUserMessage } from "./deleteUserMessage";

export const middlewares = new Composer();

middlewares.use(deleteUserMessage);
