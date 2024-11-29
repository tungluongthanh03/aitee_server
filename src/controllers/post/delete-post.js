import { PostRepo, ReactRepo } from '../../models/index.js';
import { deleteMedia } from '../../services/cloudinary/index.js';

export const deletePost = async (req, res) => {
    try {
        const post = await PostRepo.findOne({
            where: {
                id: req.params.postId,
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

/**
 * @swagger
 * /post/{postId}:
 *   delete:
 *     summary: Delete a post by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Post
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to delete
 *     responses:
 *       "200":
 *         description: Post deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post deleted successfully.
 *       "403":
 *         description: You are not authorized to delete this post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: You are not authorized to delete this post.
 *       "404":
 *         description: Post not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Post not found.
 *       "500":
 *         description: An internal server error occurred, please try again.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An internal server error occurred, please try again.
 */
