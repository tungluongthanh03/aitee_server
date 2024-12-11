import { FriendRepo } from '../../models/index.js';
import { validateGetFriends } from '../../validators/friend.validator.js';

export default async (req, res) => {
    try {
        const friendId = req.params.userId;
        const relation = await FriendRepo.findOne({
            where: [
                { acceptorId: friendId, acceptedId: req.user.id },
                { acceptorId: req.user.id, acceptedId: friendId },
            ],
        });
        if (!relation) {
            return res
                .status(403)
                .json({ message: "You cannot see friends of people who aren't your friends." });
        }
        const { error } = validateGetFriends(req.query);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit;

        let [friends, total] = await FriendRepo.findAndCount({
            where: [{ acceptorId: friendId }, { acceptedId: friendId }],
            take: limit,
            skip,
            order: { createdAt: 'DESC' },
            relations: ['acceptor', 'accepted'],
        });

        // Omit user's data
        friends = friends.map((friend) => ({
            createdAt: friend.createdAt,
            user: {
                id: friend.acceptorId === friendId ? friend.accepted.id : friend.acceptor.id,
                username:
                    friend.acceptorId === friendId
                        ? friend.accepted.username
                        : friend.acceptor.username,
                avatar:
                    friend.acceptorId === friendId
                        ? friend.accepted.avatar
                        : friend.acceptor.avatar,
                firstName:
                    friend.acceptorId === friendId
                        ? friend.accepted.firstName
                        : friend.acceptor.firstName,
                lastName:
                    friend.acceptorId === friendId
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
 * /friend/list-friend-other/{userId}:
 *   get:
 *     summary: Get a list of friends of another user
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Friend
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose friends you want to retrieve
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
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           username:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                 total:
 *                   type: integer
 *                   description: Total number of friends
 *       "400":
 *         description: Invalid query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Result'
 *       "403":
 *         description: Forbidden. You do not have access to this resource.
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
