import { BlockRepo, PostRepo, ReactRepo } from '../../models/index.js';
import { validateGetReacts } from '../../validators/post.validator.js';

export const getReacts = async (req, res) => {
    try {
        const { error } = validateGetReacts(req.query);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // check if current user is blocked by the post owner
        const block = await BlockRepo.findOne({
            where: {
                blocker: { id: req.params.userId },
                blocked: { id: req.user.id },
            },
        });

        if (block) {
            return res.status(403).json({
                error: 'You do not have permission to view reactions for this post.',
            });
        }

        const post = await PostRepo.findOne({
            where: {
                id: req.params.postId,
            },
        });

        if (!post) {
            return res.status(404).json({
                error: 'Post not found.',
            });
        }

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit;

        let [reactions, total] = await ReactRepo.findAndCount({
            where: {
                post: { id: post.id },
            },
            order: {
                createdAt: 'DESC',
            },
            relations: ['user'],
            take: limit,
            skip,
        });

        reactions = reactions.map((reaction) => ({
            user: {
                id: reaction.user.id,
                username: reaction.user.username,
                avatar: reaction.user.avatar,
                firstName: reaction.user.firstName,
                lastName: reaction.user.lastName,
            },
            createdAt: reaction.createdAt,
        }));

        return res.status(200).json({
            reactions,
            total,
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
 * /post/{postId}/reacts:
 *   get:
 *     summary: Get reactions for a post by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Post
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to retrieve reactions for
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
 *         description: Number of reactions per page
 *     responses:
 *       "200":
 *         description: A list of reactions has been retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "123e4567-e89b-12d3-a456-426614174000"
 *                           username:
 *                             type: string
 *                             example: "john_doe"
 *                           avatar:
 *                             type: string
 *                             example: "http://example.com/avatar.jpg"
 *                           firstName:
 *                             type: string
 *                             example: "John"
 *                           lastName:
 *                             type: string
 *                             example: "Doe"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-01-01T00:00:00Z"
 *                 total:
 *                   type: integer
 *                   example: 10
 *       "400":
 *         description: Invalid query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid query parameters."
 *       "403":
 *         description: You do not have permission to view reactions for this post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "You do not have permission to view reactions for this post."
 *       "404":
 *         description: Post not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Post not found."
 *       "500":
 *         description: An internal server error occurred, please try again.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An internal server error occurred, please try again."
 */
