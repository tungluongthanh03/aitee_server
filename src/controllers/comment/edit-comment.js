import { CommentRepo } from '../../models/index.js';
import { validateUpdateComment } from '../../validators/comment.validator.js';
import { uploadMedia, deleteMedia } from '../../services/cloudinary/index.js';

export default async (req, res) => {
    try {
        const { error } = validateUpdateComment(req.body);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }

        const commentId = req.params.commentId;
        const comment = await CommentRepo.findOne({
            where: { id: commentId },
            relations: ['post', 'user'],
        });

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.post.id !== req.params.postId) {
            return res.status(403).json({
                error: 'You are not authorized to update this comment.',
            });
        }

        if (comment.user.id !== req.user.id) {
            return res.status(403).json({
                error: 'You are not authorized to update this comment.',
            });
        }

        if (req.body.content) {
            comment.content = req.body.content;
        }

        if (req.files) {
            const media = req.files.map((file) => ({ buffer: file.buffer }));

            const mediaUrls = await Promise.all(media.map((file) => uploadMedia(file)));

            const images = mediaUrls.filter((media) => media.includes('image'));
            const videos = mediaUrls.filter((media) => media.includes('video'));

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

            comment.images = images;
            comment.videos = videos;
        }

        await CommentRepo.save(comment);

        // Omit the post and user details from the response
        comment.post = { id: comment.post.id };
        comment.user = { id: comment.user.id };

        res.status(200).json({
            message: `Comment with ID ${comment.id} was updated successfully.`,
            comment,
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
 * /post/{postId}/comment/{commentId}:
 *   put:
 *     summary: Edit a comment by ID
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
 *         description: The ID of the comment to edit
 *     requestBody:
 *       description: Content and media files for the comment
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the comment
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       "200":
 *         description: Comment updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comment with ID {commentId} was updated successfully.
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       "400":
 *         description: Validation error for comment content.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Result'
 *       "403":
 *         description: You are not authorized to update this comment.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Result'
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
 *               $ref: '#/components/schemas/Result'
 */