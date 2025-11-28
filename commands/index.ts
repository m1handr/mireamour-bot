import { Composer } from "grammy";
import type { MyContext } from "../bot-fabric";
import { menuCommand } from "./menu";
import { startCommand } from "./start";
import { statsCommand } from "./stats";
import { findUserCommand, userLogsCommand } from "./userLogs";

export const commands = new Composer<MyContext>();

commands.command("start", startCommand);
commands.command("menu", menuCommand);
commands.command("stats", statsCommand);
commands.command("userlogs", userLogsCommand);
commands.command("finduser", findUserCommand);
