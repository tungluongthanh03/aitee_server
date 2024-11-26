import { UserRepo } from '../../models/index.js';
import { validateQueryUsers } from '../../validators/user.validator.js';

export default async (req, res) => {
    try {
        const { error } = validateQueryUsers(req.query);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit;

        const totalUsers = await UserRepo.count();

        const users = await UserRepo.find({
            skip,
            take: limit,
            order: {
                createdAt: 'DESC',
            },
            select: {
                password: false,
            },
        });

        return res.status(200).json({ total: totalUsers, length: users.length, users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An internal server error occurred, please try again.' });
    }
};

/**
 * @swagger
 * /user/users:
 *    get:
 *      summary: Get a list of users
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *            minimum: 1
 *          required: true
 *          description: Page number
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *            minimum: 1
 *          required: true
 *          description: Number of users per page
 *      tags:
 *        - Admin
 *      responses:
 *        "200":
 *          description: A list of users has been retrieved successfully.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          total:
 *                              type: integer
 *                          length:
 *                              type: integer
 *                          users:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/User'
 *        "400":
 *          description: Invalid query parameters.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 *        "500":
 *          description: An internal server error occurred, please try again.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 */
