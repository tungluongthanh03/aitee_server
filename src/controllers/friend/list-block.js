import { BlockRepo } from '../../models/index.js';
import { validateGetBlocks } from '../../validators/friend.validator.js';

export default async (req, res) => {
    try {
        const { error } = validateGetBlocks(req.query);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit;

        let [blocks, total] = await BlockRepo.findAndCount({
            where: { blocker: { id: req.user.id } },
            take: limit,
            skip,
            order: { createdAt: 'DESC' },
            relations: ['blocked'],
        });

        // Omit user's data
        blocks = blocks.map((friend) => ({
            createdAt: friend.createdAt,
            user: {
                id: friend.blocked.id,
                firstName: friend.blocked.firstName,
                lastName: friend.blocked.lastName,
                profilePicture: friend.blocked.profilePicture,
            },
        }));

        return res.status(200).json({ blocks, total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An internal server error occurred, please try again.' });
    }
};

/**
 * @swagger
 * /friend/list-blocks:
 *   get:
 *     summary: Get a list of blocked users
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
 *         description: Number of blocked users per page
 *     responses:
 *       "200":
 *         description: A list of blocked users has been retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blocks:
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
 *                             example: "123e4567-e89b-12d3-a456-426614174000"
 *                           firstName:
 *                             type: string
 *                             example: "John"
 *                           lastName:
 *                             type: string
 *                             example: "Doe"
 *                           profilePicture:
 *                             type: string
 *                             example: "http://example.com/avatar.jpg"
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
