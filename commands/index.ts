import { Composer } from "grammy";
import type { MyContext } from "..";
import { detailedStatsCommand } from "./detailedStats";
import { menuCommand } from "./menu";
import { resetLikes } from "./resetLikes";
import { resetProfile } from "./resetProfile";
import { startCommand } from "./start";
import { statsCommand } from "./stats";
import { findUserCommand, userLogsCommand } from "./userLogs";

export const commands = new Composer<MyContext>();

commands.command("start", startCommand);
commands.command("menu", menuCommand);
commands.command("resetProfile", resetProfile);
commands.command("resetLikes", resetLikes);
commands.command("stats", statsCommand);
commands.command("statistics", detailedStatsCommand);
commands.command("userlogs", userLogsCommand);
commands.command("finduser", findUserCommand);
