import { PostRepo } from '../../models/index.js';
import { validateGetPosts } from '../../validators/post.validator.js';

export const getPostsByUserId = async (req, res) => {
    try {
        const { error } = validateGetPosts(req.query);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit;

        let [posts, total] = await PostRepo.findAndCount({
            take: limit,
            skip,
            order: {
                createdAt: 'DESC',
            },
            where: {
                user: { id: req.params.userId },
            },
            relations: ['reactions'],
        });

        // don't update the number of views and number of comments because this is admin route

        // remove the reactions from the response and add the number of reactions
        posts = posts.map((post) => {
            return {
                ...post,
                nReactions: post.reactions.length,
                reactions: undefined,
            };
        });

        return res.status(200).json({
            posts,
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
 * /post/{userId}/posts:
 *   get:
 *     summary: Get posts by user ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve posts for
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
 *         description: Number of posts per page
 *     responses:
 *       "200":
 *         description: A list of posts has been retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
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
 *                       nViews:
 *                         type: integer
 *                       nReactions:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       "400":
 *         description: Invalid query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Result'
 *       "404":
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found.
 *       "500":
 *         description: An internal server error occurred, please try again.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Result'
 */
