import { ReportPostRepo, PostRepo } from '../../models/index.js';

export const listReportPost = async (req, res) => {
    try {
        const page = parseInt(req.query.page || 1);
        const limit = parseInt(req.query.limit || 1);
        const skip = (page - 1) * limit;

        // get all post reports
        const query1 = `
            WITH PostDetails AS (
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
                    END AS "isReacted",
                    "p"."id" AS "postId"
                FROM "posts" "p"
                LEFT JOIN "reacts" "r" ON "r"."postId" = "p"."id"
                LEFT JOIN "comments" "c" ON "c"."postId" = "p"."id"
                GROUP BY "p"."id"
            )
            SELECT 
                "rp"."id" AS "reportId",
                "rp"."nReport",
                "rp"."reportRate",
                "rp"."createdAt" AS "reportCreatedAt",
                pd.*
            FROM "reportPosts" "rp"
            LEFT JOIN PostDetails pd ON pd."postId" = "rp"."postId"
            WHERE "rp"."status" = false AND "rp"."canRequestAdmin" = true
            ORDER BY "rp"."createdAt" DESC
            LIMIT $2 OFFSET $3;
        `;

        let posts = await ReportPostRepo.query(query1, [req.user.id, limit, skip]);

        // format posts
        posts = posts.map((post) => ({
            id: post.reportId,
            nReport: post.nReport,
            reportRate: post.reportRate,
            createdAt: post.reportCreatedAt,
            post: {
                id: post.id,
                content: post.content,
                images: post.images,
                videos: post.videos,
                nViews: post.nViews,
                createdAt: post.createdAt,
                userId: post.userId,
                nReactions: post.nReactions,
                nComments: post.nComments,
                isReacted: post.isReacted,
            },
        }));

        if (posts.length === 0) {
            return res.status(404).json({ error: 'No reports found with the given conditions.' });
        }

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
            const comments = await PostRepo.query(query2, [post.post.id]);

            post.post.sampleComments = comments;
            post.post.nReactions = +post.post.nReactions;
            post.post.nComments = +post.post.nComments;
        }

        return res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An internal server error occurred, please try again.' });
    }
};

/**
 * @swagger
 * /report/report-list-post:
 *    get:
 *      summary: List reports of posts
 *      description: Retrieve a paginated list of reports for posts that meet specific conditions.
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: page
 *          in: query
 *          required: false
 *          description: The page number for pagination.
 *          schema:
 *            type: integer
 *            example: 1
 *      tags:
 *        - Post Reports
 *      responses:
 *        "200":
 *          description: A list of reports for posts.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  posts:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          example: "report123"
 *                        status:
 *                          type: boolean
 *                          example: false
 *                        canRequestAdmin:
 *                          type: boolean
 *                          example: true
 *                        createdAt:
 *                          type: string
 *                          format: date-time
 *                          example: "2024-12-04T12:00:00Z"
 *                        post:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: string
 *                              example: "post123"
 *                            content:
 *                              type: string
 *                              example: "Example post content"
 *                            nViews:
 *                              type: integer
 *                              example: 100
 *                  total:
 *                    type: integer
 *                    example: 5
 *        "404":
 *          description: No reports found or no more reports available.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: No reports found with the given conditions.
 *        "500":
 *          description: Internal server error.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: An internal server error occurred, please try again.
 */
