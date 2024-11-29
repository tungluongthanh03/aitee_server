import { UserRepo, PostRepo, CommentRepo } from '../../models/index.js';
import { validateCreateComment } from '../../validators/comment.validator.js';
import { uploadMedia } from '../../services/cloudinary/index.js';

export default async (req, res) => {
    try {
        const { error } = validateCreateComment(req.body);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }

        // check post
        const postId = req.params.postId;
        const post = await PostRepo.findOneBy({ id: postId });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // get root comment
        let rootComment = null;
        if (req.body.rootComment) {
            rootComment = await CommentRepo.findOneBy({ id: req.body.rootComment });
            if (!rootComment) {
                return res.status(404).json({ error: 'Root comment not found' });
            }
        }

        const comment = CommentRepo.create({
            content: req.body.content,
            post: post,
            user: req.user,
            root: rootComment,
        });

        if (req.files) {
            const media = req.files.map((file) => ({ buffer: file.buffer }));

            const mediaUrls = await Promise.all(media.map((file) => uploadMedia(file)));

            const images = mediaUrls.filter((media) => media.includes('image'));
            const videos = mediaUrls.filter((media) => media.includes('video'));

            comment.images = images;
            comment.videos = videos;
        }

        await CommentRepo.save(comment);

        comment.post = { id: post.id };
        comment.user = { id: req.user.id };
        comment.root = rootComment ? { id: rootComment.id } : null;

        return res.status(201).json({
            message: 'Comment added successfully',
            comment,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'An internal server error occurred, please try again.',
        });
    }
};

/**
 * @swagger
 * /post/{postId}/comment:
 *   post:
 *     summary: Create a new comment
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
 *         description: The ID of the post to comment on
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
 *               rootComment:
 *                 type: string
 *                 nullable: true
 *                 description: The ID of the root comment
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       "201":
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comment added successfully
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       "400":
 *         description: Validation error for comment content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Result'
 *       "404":
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Post not found
 *       "500":
 *         description: An internal server error occurred, please try again.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Result'
 */
