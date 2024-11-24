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

        if (post.user.id !== req.user.id) {
            return res.status(403).json({
                error: 'You are not authorized to update this post.',
            });
        }

        post.content = req.body.content;

        if (req.files) {
            const media = req.files.map((file) => ({
                buffer: file.buffer,
            }));

            const mediaUrls = await Promise.all(media.map((file) => uploadMedia(file)));

            const images = mediaUrls.filter((media) => media.includes('image'));
            const videos = mediaUrls.filter((media) => media.includes('video'));

            if (post.images) {
                const oldImages = post.images.map((image) => image.public_id);
                await deleteMedia(oldImages);
            }

            if (post.videos) {
                const oldVideos = post.videos.map((video) => video.public_id);
                await deleteMedia(oldVideos);
            }

            post.images = images;
            post.videos = videos;
        }

        await PostRepo.save(post);

        return res.status(200).json({
            message: 'Post updated successfully.',
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: 'An internal server error occurred, please try again.' });
    }
};
