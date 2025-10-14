import { Composer } from "grammy";
import { menuCommand } from "./menu";
import { startCommand } from "./start";

export const commands = new Composer();

commands.command("start", startCommand);
commands.command("menu", menuCommand);
