import { S3Client } from "bun";
import { config } from "./env";

export const S3_ENDPOINT = "https://storage.yandexcloud.net";
export const S3_BUCKET_NAME = "obsy-storage";

export const s3 = new S3Client({
  endpoint: S3_ENDPOINT,
  region: "ru-central1",
  accessKeyId: config.S3_KEY_ID,
  secretAccessKey: config.S3_SECRET_KEY,
  bucket: S3_BUCKET_NAME,
});
