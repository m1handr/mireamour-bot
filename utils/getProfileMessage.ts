import type { User } from "../lib/generated/prisma";

export const getProfileMessage = (user: User, showUsername = false) => {
  let namePart = user.name;

  if (showUsername && user.username) {
    namePart = `<a href="https://t.me/${user.username}">${user.name}</a>`;
  }

  const bannedNotice =
    user.role === "banned"
      ? "<b>🚫 Профиль заблокирован.</b> \nВы можете попробовать оспорить блокировку, написав в техническую поддержку.\n\n"
      : "";

  return `${user.gender === "female" ? "👩" : "👨"} <b>${namePart}, ${
    user.age ?? ""
  }</b>\n\n${bannedNotice}${
    user.description ? `<blockquote>${user.description}</blockquote>` : ""
  }`;
};
