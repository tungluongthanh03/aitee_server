import { PostRepo } from '../../models/index.js';

export const getPost = async (req, res) => {
    try {
        const post = await PostRepo.createQueryBuilder('post')
            .leftJoinAndSelect('post.reactions', 'reactions')
            .leftJoinAndSelect('post.comments', 'comments')
            .leftJoin(
                'Block',
                'block',
                'block.blockedId = :requestUserId AND block.blockerId = post.userId',
                { requestUserId: req.user.id },
            )
            .where('post.id = :postId', { postId: req.params.postId })
            .andWhere('block.blockedId IS NULL')
            .getOne();

        if (!post) {
            return res.status(404).json({
                error: 'Post not found or you are blocked by the post owner.',
            });
        }

        // Update nViews
        post.nViews += 1;
        await PostRepo.save(post);

        // Format post data
        post.nReactions = post.reactions ? post.reactions.length : 0;
        post.reactions = undefined;

        post.nComments = post.comments ? post.comments.length : 0;
        post.sampleComments = post.comments ? post.comments.slice(0, 3) : [];
        post.comments = undefined;

        return res.status(200).json({
            post,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'An internal server error occurred, please try again.',
        });
    }
};

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Get a post by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to retrieve
 *     responses:
 *       "200":
 *         description: The post information has been retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     content:
 *                       type: string
 *                       example: "This is a sample post content."
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "http://example.com/image.jpg"
 *                     videos:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "http://example.com/video.mp4"
 *                     nViews:
 *                       type: integer
 *                       example: 100
 *                     nReactions:
 *                       type: integer
 *                       example: 10
 *                     nComments:
 *                       type: integer
 *                       example: 5
 *                     sampleComments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "123e4567-e89b-12d3-a456-426614174001"
 *                           content:
 *                             type: string
 *                             example: "This is a sample comment."
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2023-01-01T00:00:00Z"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T00:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T00:00:00Z"
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
