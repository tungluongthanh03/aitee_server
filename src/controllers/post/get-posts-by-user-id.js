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
        const offset = (page - 1) * limit;

        // Query to fetch posts with reaction and comment counts, and isReacted
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
            WHERE "p"."userId" = $2 AND "b"."blockedId" IS NULL
            GROUP BY "p"."id"
            ORDER BY "p"."createdAt" DESC
            LIMIT $3 OFFSET $4
        `;

        const posts = await PostRepo.query(query1, [req.user.id, req.params.userId, limit, offset]);

        // Query to fetch sample comments for each post
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

        // Add sample comments and format posts
        for (let post of posts) {
            const comments = await PostRepo.query(query2, [post.id]);

            post.sampleComments = comments;
            post.nReactions = +post.nReactions;
            post.nComments = +post.nComments;

            // Increment the number of views
            post.nViews += 1;
            await PostRepo.save(post);
        }

        // Total posts count
        const totalQuery = `
            SELECT COUNT(*) AS "total"
            FROM "posts" "p"
            LEFT JOIN "blocks" "b" ON "b"."blockedId" = $1 AND "b"."blockerId" = "p"."userId"
            WHERE "p"."userId" = $2 AND "b"."blockedId" IS NULL
        `;
        const totalResult = await PostRepo.query(totalQuery, [req.user.id, req.params.userId]);
        const total = totalResult[0]?.total || 0;

        return res.status(200).json({
            posts,
            total,
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
