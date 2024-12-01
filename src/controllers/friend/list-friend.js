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

        let [friends, total] = await FriendRepo.findAndCount({
            where: [{ acceptorId: req.params.id }, { acceptedId: req.params.id }],
            take: limit,
            skip,
            order: { createdAt: 'DESC' },
            relations: ['acceptor', 'accepted'],
        });

        // Omit user's data
        friends = friends.map((friend) => ({
            createdAt: friend.createdAt,
            user: {
                id: friend.acceptorId === req.user.id ? friend.accepted.id : friend.acceptor.id,
                username:
                    friend.acceptorId === req.user.id
                        ? friend.accepted.username
                        : friend.acceptor.username,
                avatar:
                    friend.acceptorId === req.user.id
                        ? friend.accepted.avatar
                        : friend.acceptor.avatar,
                firstName:
                    friend.acceptorId === req.user.id
                        ? friend.accepted.firstName
                        : friend.acceptor.firstName,
                lastName:
                    friend.acceptorId === req.user.id
                        ? friend.accepted.lastName
                        : friend.acceptor.lastName,
            },
        }));

        return res.status(200).json({ friends, total });
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
 *                       acceptor:
 *                         $ref: '#/components/schemas/User'
 *                       accepted:
 *                         $ref: '#/components/schemas/User'
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
 *       "400":
 *         description: Invalid query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Result'
 *       "500":
 *         description: An internal server error occurred, please try again.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Result'
 */