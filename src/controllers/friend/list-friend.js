import { FriendRepo } from '../../models/index.js';
import { validateGetFriends } from '../../validators/friend.validator.js';

export default async (req, res) => {
    try {
        const { error } = validateGetFriends(req.query);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit;

        const query = `
            SELECT * FROM friends
            WHERE "acceptorId" = $1 OR "acceptedId" = $1
            ORDER BY "createdAt" DESC
            LIMIT $2 OFFSET $3
        `;

        const list = await FriendRepo.query(query, [req.user.id, limit, skip]);

        const query1 = `
            SELECT "id", "username", "avatar", "firstName", "lastName"
            FROM "users"
            WHERE "id" = $1
        `;

        const friends = await Promise.all(
            list.map(async (friend) => {
                const user = await FriendRepo.query(query1, [
                    friend.acceptorId === req.user.id ? friend.acceptedId : friend.acceptorId,
                ]);
                return {
                    createdAt: friend.createdAt,
                    user: user[0] || {},
                };
            }),
        );

        return res.status(200).json({ friends });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An internal server error occurred, please try again.' });
    }
};

/**
 * @swagger
 * /friend/list-friends:
 *   get:
 *     summary: Get a list of friends
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Friend
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
 *         description: Number of friends per page
 *     responses:
 *       "200":
 *         description: A list of friends has been retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 friends:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-01-01T00:00:00Z"
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "123e4567-e89b-12d3-a456-426614174000"
 *                           username:
 *                             type: string
 *                             example: "john_doe"
 *                           avatar:
 *                             type: string
 *                             example: "http://example.com/avatar.jpg"
 *                           firstName:
 *                             type: string
 *                             example: "John"
 *                           lastName:
 *                             type: string
 *                             example: "Doe"
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
 *                   example: Invalid query parameters.
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
