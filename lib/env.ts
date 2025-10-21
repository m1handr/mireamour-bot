import { ArkErrors, type } from "arktype";

export const envSchema = type({
  TELEGRAM_BOT_TOKEN: "string",
  DATABASE_URL: "string",
  S3_KEY_ID: "string",
  S3_SECRET_KEY: "string",
  CHANNEL_ID: "string",
  CHANNEL_USERNAME: "string",
  ADMIN_CHAT_ID: "string",
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
