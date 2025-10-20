import type { User } from "../lib/generated/prisma";

export const getProfileMessage = (user: User) => {
  return `${user.gender === "female" ? "👩" : "👨"} <b>${user.name}, ${
    user.age
  }</b>\n\n${
    user.description ? `<blockquote>${user.description}</blockquote>` : ""
  }`;
};
