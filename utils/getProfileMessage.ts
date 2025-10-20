import type { User } from "../lib/generated/prisma";

export const getProfileMessage = (user: User, showUsername = false) => {
  let namePart = user.name;

  if (showUsername && user.username) {
    namePart = `<a href="https://t.me/${user.username}">${user.name}</a>`;
  }

  return `${user.gender === "female" ? "👩" : "👨"} <b>${namePart}, ${
    user.age ?? ""
  }</b>\n\n${
    user.description ? `<blockquote>${user.description}</blockquote>` : ""
  }`;
};
