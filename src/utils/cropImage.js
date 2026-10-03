/**
 * Creates an Image element from a source url/base64.
 */
export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

/**
 * Returns a 400x400 cropped image as a data URL.
 * @param {string} imageSrc - The source of the image (object URL or data URL)
 * @param {object} pixelCrop - { x, y, width, height }
 * @returns {Promise<string>} - 400x400 image base64 data URL
 */
export default async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get 2d context for canvas");
  }

  // Desired output resolution: 400x400 square
  canvas.width = 400;
  canvas.height = 400;

  // Draw the cropped portion scaled to 400x400
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    400,
    400
  );

  return canvas.toDataURL("image/webp", 0.92);
}
