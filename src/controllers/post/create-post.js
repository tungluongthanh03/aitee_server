import { PostRepo } from '../../models/index.js';
import { validateCreatePost } from '../../validators/post.validator.js';
import { uploadMedia } from '../../services/cloudinary/index.js';

export const createPost = async (req, res) => {
    try {
        const { error } = validateCreatePost(req.body);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }

        const post = PostRepo.create({
            content: req.body.content,
            user: req.user,
        });

        if (req.files) {
            const media = req.files.map((file) => ({
                buffer: file.buffer,
                mimetype: file.mimetype,
            }));

            const mediaUrls = await Promise.all(media.map((file) => uploadMedia(file)));

            const images = mediaUrls.filter((media) => media.includes('image'));
            const videos = mediaUrls.filter((media) => media.includes('video'));

            post.images = images;
            post.videos = videos;
        }

        await PostRepo.save(post);

        return res.status(200).json({
            message: 'Post created successfully.',
            post,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: 'An internal server error occurred, please try again.' });
    }
};
