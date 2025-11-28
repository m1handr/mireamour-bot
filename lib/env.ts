import { ArkErrors, type } from "arktype";

export const envSchema = type({
  MIREA_BOT_TOKEN: "string",
  MIIT_BOT_TOKEN: "string",
  MIREA_CHANNEL_USERNAME: "string",
  MIIT_CHANNEL_USERNAME: "string",
  MIREA_CHANNEL_ID: "string",
  MIIT_CHANNEL_ID: "string",
  ADMIN_CHAT_ID: "string",
  DATABASE_URL: "string",
  S3_KEY_ID: "string",
  S3_SECRET_KEY: "string",
  NODE_ENV: "string?",
  LOG_LEVEL: "string?",
});

const validationResult = envSchema(process.env);

if (validationResult instanceof ArkErrors) {
  console.error("❌ Ошибка валидации .env:", validationResult);
  process.exit(1);
}

export const config = {
  ...validationResult,
  NODE_ENV: validationResult.NODE_ENV ?? "development",
  LOG_LEVEL: validationResult.LOG_LEVEL ?? "info",
} as const;
