import { createId } from "@paralleldrive/cuid2";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("role", ["banned", "default", "moder"]);
export const genderEnum = pgEnum("gender", ["male", "female", "none"]);
export const likeTypeEnum = pgEnum("like_type", ["like", "dislike"]);

export const users = pgTable("users", {
  id: text().primaryKey(),
  name: text(),
  age: integer(),
  gender: genderEnum().notNull().default("none"),
  description: text(),
  imageUrls: text().array().notNull().default([]),
  isVisible: boolean().notNull().default(false),
  role: userRoleEnum().notNull().default("default"),
  createdAt: timestamp().notNull().defaultNow(),
});

export const likes = pgTable("likes", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  fromUserId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  toUserId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: likeTypeEnum().notNull().default("like"),
  createdAt: timestamp().notNull().defaultNow(),
});

export const matches = pgTable("matches", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  userAId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  userBId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp().notNull().defaultNow(),
});
