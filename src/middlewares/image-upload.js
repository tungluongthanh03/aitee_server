import multer, { memoryStorage } from 'multer';

const storage = memoryStorage();
const fileFilter = (_req, file, cb) => {
    console.log(file);
    if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/svg+xml' ||
        file.mimetype === 'image/gif' ||
        file.mimetype === 'image/webp'
    ) {
        cb(null, true);
    } else {
        cb(new Error('Please choose a valid image file.'), false);
    }
};

export default multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB
    fileFilter: fileFilter,
});
