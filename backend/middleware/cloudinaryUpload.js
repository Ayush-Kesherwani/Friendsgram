// import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
