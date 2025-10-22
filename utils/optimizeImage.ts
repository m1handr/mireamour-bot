import sharp from "sharp";

export async function optimizeImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .rotate()
    .resize({
      width: 1280,
      withoutEnlargement: true,
    })
    .toFormat("webp", {
      quality: 80,
    })
    .toBuffer();
}
