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

        const postId = req.params.postId;

        // get post
        const queryPost = `
            SELECT "p".*
            FROM "posts" "p"
            LEFT JOIN "blocks" "b" ON "b"."blockedId" = $1 AND "b"."blockerId" = "p"."userId"
            WHERE "p"."id" = $2 AND "b"."blockedId" IS NULL
        `;

        const posts = await PostRepo.query(queryPost, [req.user.id, postId]);
        const post = posts.length ? posts[0] : null;

        if (!post) {
            return res.status(404).json({
                error: 'Post not found or you are blocked by the post owner.',
            });
        }

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;
        const queryComments = `
            SELECT 
                c.*,
                u."username" AS "repliedUser"
            FROM "comments" c
            LEFT JOIN "comments" root ON c."rootId" = root."id"
            LEFT JOIN "users" u ON root."userId" = u."id"
            WHERE c."postId" = $1
            ORDER BY c."createdAt" DESC
            LIMIT $2 OFFSET $3
        `;

        const comments = await PostRepo.query(queryComments, [postId, limit, offset]);

        // get total comments
        const totalQuery = `
            SELECT COUNT(*) AS "totalComments"
            FROM "comments"
            WHERE "postId" = $1
        `;
        const totalResult = await PostRepo.query(totalQuery, [postId]);
        const total = totalResult[0] ? +totalResult[0].totalComments : 0;

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
