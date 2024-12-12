import { PostRepo } from '../../models/index.js';

export const getPost = async (req, res) => {
    try {
        // get post by id
        const query1 = `
            SELECT 
                "p".*,
                COUNT(DISTINCT "r"."postId") AS "nReactions",
                COUNT(DISTINCT "c"."id") AS "nComments",
                CASE 
                    WHEN EXISTS (
                        SELECT 1 
                        FROM "reacts" "ur" 
                        WHERE "ur"."postId" = "p"."id" AND "ur"."userId" = $1
                    ) THEN true 
                    ELSE false 
                END AS "isReacted"
            FROM "posts" "p"
            LEFT JOIN "blocks" "b" ON "b"."blockedId" = $1 AND "b"."blockerId" = "p"."userId"
            LEFT JOIN "reacts" "r" ON "r"."postId" = "p"."id"
            LEFT JOIN "comments" "c" ON "c"."postId" = "p"."id"
            WHERE "p"."id" = $2 AND "b"."blockedId" IS NULL
            GROUP BY "p"."id"
        `;

        const posts = await PostRepo.query(query1, [req.user.id, req.params.postId]);
        const post = posts.length ? posts[0] : null;

        // get sample comments
        const query2 = `
            SELECT 
                c.*,
                u."username" AS "repliedUser"
            FROM "comments" c
            LEFT JOIN "comments" root ON c."rootId" = root."id"
            LEFT JOIN "users" u ON root."userId" = u."id"
            WHERE c."postId" = $1
            ORDER BY c."createdAt" DESC
            LIMIT 3
        `;

        const comments = await PostRepo.query(query2, [req.params.postId]);

        if (!post) {
            return res.status(404).json({
                error: 'Post not found or you are blocked by the post owner.',
            });
        }

        // Update nViews
        post.nViews += 1;
        await PostRepo.save(post);

        // Format post data
        post.sampleComments = comments;
        post.nReactions = +post.nReactions;
        post.nComments = +post.nComments;

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
