import { PostRepo } from '../../models/index.js';

export const getPost = async (req, res) => {
    try {
        const post = await PostRepo.findOne({
            where: {
                id: req.params.postId,
            },
            relations: ['reactions', 'comments'],
        });

        if (!post) {
            return res.status(404).json({
                error: 'Post not found.',
            });
        }

        // update the number of views
        post.nViews += 1;
        await PostRepo.save(post);

        // remove the reactions from the response and add the number of reactions
        post.nReactions = post.reactions ? post.reactions.length : 0;
        post.reactions = undefined;

        // remove the comments from the response and add the number of comments
        post.nComments = post.comments ? post.comments.length : 0;
        post.sampleComments = post.comments ? post.comments.slice(0, 3) : [];
        post.comments = undefined;

        return res.status(200).json({
            post,
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
 *                     content:
 *                       type: string
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                     videos:
 *                       type: array
 *                       items:
 *                         type: string
 *                     nViews:
 *                       type: integer
 *                     nReactions:
 *                       type: integer
 *                     nComments:
 *                       type: integer
 *                     sampleComments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Comment'
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
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
