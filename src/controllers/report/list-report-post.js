import { ReportPostRepo } from '../../models/index.js';

export const listReportPost = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = 1;
        const skip = (page - 1) * limit;

        const [posts, total] = await ReportPostRepo.findAndCount({
            take: limit,
            skip,
            order: {
                createdAt: 'DESC',
            },
            where: {
                status: false,
                canRequestAdmin: true,
            },
            relations: ['post'],
        });

        if (total === 0) {
            return res.status(404).json({ message: 'No reports found with the given conditions.' });
        }
        if (skip >= total) {
            return res.status(404).json({ message: 'No more reports available.' });
        }

        return res.status(200).json({ posts, total });
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
