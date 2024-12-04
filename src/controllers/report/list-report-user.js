import { ReportUserRepo } from '../../models/index.js';

export const listReportUser = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = 1;
        const skip = (page - 1) * limit;
        const [users, total] = await ReportUserRepo.findAndCount({
            take: limit,
            skip,
            order: {
                createdAt: 'DESC',
            },
            where: {
                status: false,
                canRequestAdmin: true,
            },
            relations: ['user'],
        });
        if (skip >= total) {
            return res.status(404).json({ message: 'No more reports available.' });
        }
        if (total === 0) {
            return res.status(404).json({ message: 'No reports found with the given conditions.' });
        }

        return res.status(200).json({ users, total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An internal server error occurred, please try again.' });
    }
};

/**
 * @swagger
 * /report/report-list-user:
 *    get:
 *      summary: List reports of users
 *      description: Retrieve a paginated list of reports for users that meet specific conditions.
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
 *        - User Reports
 *      responses:
 *        "200":
 *          description: A list of reports for users.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  users:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          example: "reportUser123"
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
 *                        user:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: string
 *                              example: "user123"
 *                            name:
 *                              type: string
 *                              example: "John Doe"
 *                            email:
 *                              type: string
 *                              example: "john.doe@example.com"
 *                  total:
 *                    type: integer
 *                    example: 10
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
