
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: 'dximgyhxp',
  api_key: '969961721382233',
  api_secret: 'lEnf51RpEr5xvyXER4MwoVWM42g',
});

export const userStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'user_profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

export const tenantStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'tenant_profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

export { cloudinary };
