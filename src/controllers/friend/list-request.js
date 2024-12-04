import { UserRepo, RequestRepo } from '../../models/index.js';
import { validateGetRequests } from '../../validators/friend.validator.js';

export default async (req, res) => {
    try {
        const { error } = validateGetRequests(req.query);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit;

        let [requests, total] = await RequestRepo.findAndCount({
            where: { receiverId: req.user.id },
            take: limit,
            skip,
            order: { createdAt: 'DESC' },
            relations: ['sender'],
        });

        // Omit user's data
        requests = requests.map((request) => ({
            ...request,
            sender: {
                id: request.sender.id,
                username: request.sender.username,
                avatar: request.sender.avatar,
                firstName: request.sender.firstName,
                lastName: request.sender.lastName,
            },
            senderId: undefined,
            receiverId: undefined,
        }));

        return res.status(200).json({ requests, total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An internal server error occurred, please try again.' });
    }
};

/**
 * @swagger
 * /friend/list-requests:
 *   get:
 *     summary: Get a list of friend requests
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
 *         description: Number of requests per page
 *     responses:
 *       "200":
 *         description: A list of friend requests has been retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 requests:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       sender:
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
 *                       createdAt:
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

