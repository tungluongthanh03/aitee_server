import { PostRepo, ReactRepo } from '../../models/index.js';
import { deleteMedia } from '../../services/cloudinary/index.js';

export const deletePost = async (req, res) => {
    try {
        const post = await PostRepo.findOne({
            where: {
                id: req.params.id,
            },
            relations: ['user'],
        });

        if (!post) {
            return res.status(404).json({
                error: 'Post not found.',
            });
        }

        if (post.user.id !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({
                error: 'You are not authorized to delete this post.',
            });
        }

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

        const reactions = await ReactRepo.find({
            where: {
                post: { id: post.id },
                user: { id: req.user.id },
            },
        });

        await ReactRepo.remove(reactions);

        await PostRepo.remove(post);

        return res.status(200).json({
            message: 'Post deleted successfully.',
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: 'An internal server error occurred, please try again.' });
    }
};
