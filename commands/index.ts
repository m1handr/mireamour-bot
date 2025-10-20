import { Composer } from "grammy";
import type { MyContext } from "..";
import { menuCommand } from "./menu";
import { resetLikes } from "./resetLikes";
import { resetProfile } from "./resetProfile";
import { startCommand } from "./start";

export const commands = new Composer<MyContext>();

commands.command("start", startCommand);
commands.command("menu", menuCommand);
commands.command("resetProfile", resetProfile);
commands.command("resetLikes", resetLikes);
