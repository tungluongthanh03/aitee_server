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

        const queryBuilder = PostRepo.createQueryBuilder('post');
        queryBuilder
            .leftJoin(
                'Block',
                'block',
                'block.blockedId = :currentUserId AND block.blockerId = :postOwnerId',
                {
                    currentUserId: req.user.id,
                    postOwnerId: req.params.userId,
                },
            )
            .where('post.userId = :postOwnerId', { postOwnerId: req.params.userId })
            .andWhere('block.blockedId IS NULL')
            .skip(skip)
            .take(limit)
            .orderBy('post.createdAt', 'DESC')
            .leftJoinAndSelect('post.reactions', 'reactions')
            .leftJoinAndSelect('post.comments', 'comments');

        let [posts, total] = await queryBuilder.getManyAndCount();

        // update the number of views
        posts.forEach(async (post) => {
            post.nViews += 1;
            await PostRepo.save(post);
        });

        // remove the reactions from the response and add the number of reactions
        posts = posts.map((post) => {
            return {
                ...post,
                nReactions: post.reactions.length,
                reactions: undefined,
            };
        });

        // remove the comments from the response and add the number of comments
        posts = posts.map((post) => {
            return {
                ...post,
                nComments: post.comments.length,
                sampleComments: post.comments.slice(0, 3),
                comments: undefined,
            };
        });

        return res.status(200).json({
            posts,
            total,
        });
    } catch (error) {
        console.error(error);
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
 *       - Post
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
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       content:
 *                         type: string
 *                         example: "This is a sample post content."
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "http://example.com/image.jpg"
 *                       videos:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "http://example.com/video.mp4"
 *                       nViews:
 *                         type: integer
 *                         example: 100
 *                       nReactions:
 *                         type: integer
 *                         example: 10
 *                       nComments:
 *                         type: integer
 *                         example: 5
 *                       sampleComments:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "123e4567-e89b-12d3-a456-426614174001"
 *                             content:
 *                               type: string
 *                               example: "This is a sample comment."
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                               example: "2023-01-01T00:00:00Z"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-01-01T00:00:00Z"
 *                       updatedAt:
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
 *       "404":
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found."
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
