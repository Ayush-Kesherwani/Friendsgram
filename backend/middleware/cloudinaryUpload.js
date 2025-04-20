import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'friendsgram/posts',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'webp'],
    transformation: [{ width: 800, height: 1000, crop: 'limit' }],
  },
});

const upload = multer({ storage });

export default upload;
