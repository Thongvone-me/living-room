import { cloudinary } from "../configuration/cloudinary.folderImage.js";

export async function deleteCloudinaryImage(imageUrl) {
  if (!imageUrl) return;
  const matches = imageUrl.match(/upload\/v\d+\/(.*)\.[a-zA-Z]+$/);
  const publicId = matches ? matches[1] : null;
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error('Cloudinary deletion error:', err);
    }
  }
}
