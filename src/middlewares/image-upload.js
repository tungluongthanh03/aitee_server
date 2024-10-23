import multer, { diskStorage } from 'multer';
import path from 'path';
import fs from 'fs';

const dir = 'uploads/images';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const fileFilter = (_req, file, cb) => {
    if (
        file.mimetype === 'image/jpeg+jpg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/svg+xml'
    ) {
        cb(null, true);
    } else {
        cb(new Error('Please choose a valid image file.'), false);
    }
};

const storage = diskStorage({
    destination: function (req, file, cb) {
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const randomString = '___' + Date.now() + '___' + Math.round(Math.random() * 1e9);
        const filename = req.user.id + randomString + path.extname(file.originalname);
        req.file = { filename };
        cb(null, filename);
    },
});

export default multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB
    fileFilter: fileFilter,
});
