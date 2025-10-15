import { Composer } from "grammy";
import type { MyContext } from "..";
import { menuCommand } from "./menu";
import { startCommand } from "./start";

export const commands = new Composer<MyContext>();

commands.command("start", startCommand);
commands.command("menu", menuCommand);
