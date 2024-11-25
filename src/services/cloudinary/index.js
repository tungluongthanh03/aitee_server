import { v2 as cloudinary } from 'cloudinary';

import { cloudinaryName, cloudinaryApiKey, cloudinarySecret } from '../../config/index.js';

cloudinary.config({
    cloud_name: cloudinaryName,
    api_key: cloudinaryApiKey,
    api_secret: cloudinarySecret,
});

const uploadMedia = (media, resourceType = 'auto') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: resourceType },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    const url = cloudinary.url(result.secure_url, {
                        transformation: [
                            {
                                quality: 'auto',
                                fetch_format: 'auto',
                            },
                        ],
                    });
                    resolve(url);
                }
            },
        );

        uploadStream.end(media.buffer);
    });
};

const deleteMedia = async (url, resourceType = 'image') => {
    const parts = url.split('/');
    const publicId = parts[parts.length - 1].split('.')[0];
    return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

export { uploadMedia, deleteMedia };
