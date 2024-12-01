import { BlockRepo, PostRepo, CommentRepo } from '../../models/index.js';
import { validateGetComments } from '../../validators/comment.validator.js';

export default async (req, res) => {
    try {
        const { error } = validateGetComments(req.query);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }

        // get post
        const post = await PostRepo.findOne({
            where: {
                id: req.query.postId,
            },
            relations: ['user'],
        });

        // check if current user is blocked by the post owner
        const block = await BlockRepo.findOne({
            where: {
                blocker: { id: post.user.id },
                blocked: { id: req.user.id },
            },
        });

        if (block) {
            return res.status(403).json({
                error: 'You do not have permission to view comments for this post.',
            });
        }

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit;

        const [comments, total] = await CommentRepo.findAndCount({
            take: limit,
            skip,
            order: {
                createdAt: 'DESC',
            },
            where: {
                post: { id: post.id },
            },
        });

        return res.status(200).json({ comments, total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An internal server error occurred, please try again.' });
    }
};

/**
 * @swagger
 * /post/{postId}/comments:
 *   get:
 *     summary: Get a list of comments for a post
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
 *         description: The ID of the post to retrieve comments for
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Number of comments per page
 *     responses:
 *       "200":
 *         description: A list of comments has been retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       content:
 *                         type: string
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                       videos:
 *                         type: array
 *                         items:
 *                           type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           username:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *       "400":
 *         description: Invalid query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid query parameters.
 *       "403":
 *         description: You do not have permission to view comments for this post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: You do not have permission to view comments for this post.
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
