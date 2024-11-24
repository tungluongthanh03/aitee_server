import multer, { memoryStorage } from 'multer';

const storage = memoryStorage();
const fileFilter = (_req, file, cb) => {
    if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/svg+xml' ||
        file.mimetype === 'video/mp4' ||
        file.mimetype === 'video/mpeg' ||
        file.mimetype === 'video/quicktime'
    ) {
        cb(null, true);
    } else {
        cb(new Error('Please choose a valid image or video file.'), false);
    }
};

export default multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: fileFilter,
});
