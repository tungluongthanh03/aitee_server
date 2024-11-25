import { PostRepo } from '../../models/index.js';
import { validateUpdatePost } from '../../validators/post.validator.js';
import { uploadMedia, deleteMedia } from '../../services/cloudinary/index.js';

export const updatePost = async (req, res) => {
    try {
        const { error } = validateUpdatePost(req.body);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }

        const post = await PostRepo.findOne({
            where: {
                id: req.params.id,
            },
        });

        if (!post) {
            return res.status(404).json({
                error: 'Post not found.',
            });
        }

        if (req.body.content) {
            post.content = req.body.content;
        }

        if (req.files) {
            const media = req.files.map((file) => ({
                buffer: file.buffer,
            }));

            const mediaUrls = await Promise.all(media.map((file) => uploadMedia(file)));

            const images = mediaUrls.filter((media) => media.includes('image'));
            const videos = mediaUrls.filter((media) => media.includes('video'));

            if (post.images) {
                post.images.forEach(async (image) => {
                    await deleteMedia(image, 'image');
                });
            }

            if (post.videos) {
                post.videos.forEach(async (video) => {
                    await deleteMedia(video, 'video');
                });
            }

            post.images = images;
            post.videos = videos;
        }

        await PostRepo.save(post);

        return res.status(200).json({
            message: 'Post updated successfully.',
            post,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: 'An internal server error occurred, please try again.' });
    }
};
