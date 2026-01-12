import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { Request } from 'express';

// ES module alternative to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage
const storage = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb) {
        // Upload to backend/uploads/events/
        const uploadPath = path.resolve(__dirname, '../../uploads/events');
        cb(null, uploadPath);
    },
    filename: function (req: Request, file: Express.Multer.File, cb) {
        // Generate unique filename: timestamp-randomstring.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `event-${uniqueSuffix}${ext}`);
    }
});

// File filter - only allow images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
    }
};

// Create multer upload instance
export const uploadEventImage = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});
