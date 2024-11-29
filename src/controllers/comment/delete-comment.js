import { CommentRepo } from '../../models/index.js';
import { deleteMedia } from '../../services/cloudinary/index.js';

export default async (req, res) => {
    try {
        const commentID = req.params.commentId;
        const comment = await CommentRepo.findOne({
            where: { id: commentID },
            relations: ['post', 'user'],
        });

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.post.id !== req.params.postId) {
            return res.status(403).json({
                error: 'You are not authorized to delete this comment.',
            });
        }

        if (comment.user.id !== req.user.id) {
            return res.status(403).json({
                error: 'You are not authorized to delete this comment.',
            });
        }

        if (comment.images) {
            comment.images.forEach(async (image) => {
                await deleteMedia(image, 'image');
            });
        }

        if (comment.videos) {
            comment.videos.forEach(async (video) => {
                await deleteMedia(video, 'video');
            });
        }

        await CommentRepo.remove(comment);

        res.status(200).json({ message: `Comment with ID ${commentID} was deleted successfully.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An internal server error occurred, please try again.' });
    }
};

/**
 * @swagger
 * /post/{postId}/comment/{commentId}:
 *   delete:
 *     summary: Delete a comment by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to which the comment belongs
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to delete
 *     responses:
 *       "200":
 *         description: Comment deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comment with ID {commentId} was deleted successfully.
 *       "403":
 *         description: You are not authorized to delete this comment.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: You are not authorized to delete this comment.
 *       "404":
 *         description: Comment not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Comment not found.
 *       "500":
 *         description: An internal server error occurred, please try again.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An internal server error occurred, please try again.
 */
