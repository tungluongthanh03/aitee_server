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

        const [users, total] = await UserRepo.findAndCount({
            skip,
            take: limit,
            order: {
                createdAt: 'DESC',
            },
            select: {
                password: false,
            },
        });

        return res.status(200).json({ total, users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An internal server error occurred, please try again.' });
    }
};

/**
 * @swagger
 * /user/users:
 *   get:
 *     summary: Get a list of users
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Number of users per page
 *     tags:
 *       - Admin
 *     responses:
 *       "200":
 *         description: A list of users has been retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       email:
 *                         type: string
 *                         example: "user@example.com"
 *                       username:
 *                         type: string
 *                         example: "username123"
 *                       phoneNumber:
 *                         type: string
 *                         example: "1234567890"
 *                       firstName:
 *                         type: string
 *                         example: "John"
 *                       lastName:
 *                         type: string
 *                         example: "Doe"
 *                       sex:
 *                         type: string
 *                         enum: ["male", "female", "other"]
 *                         example: "male"
 *                       birthday:
 *                         type: string
 *                         format: date
 *                         example: "1990-01-01"
 *                       address:
 *                         type: string
 *                         example: "123 Main St"
 *                       avatar:
 *                         type: string
 *                         example: "http://example.com/avatar.jpg"
 *                       online:
 *                         type: boolean
 *                         example: true
 *                       biography:
 *                         type: string
 *                         example: "This is a biography."
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
