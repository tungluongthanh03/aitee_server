import { MessageRepo, UserRepo } from '../../models/index.js';

export default async (req, res) => {
    const { username } = req.body;
    const currentUserId = req.user.id; // Assuming you're getting the current user's ID from a session or token

    try {
        const query = `
        
        SELECT 
            u.id AS "targetId",
            u.username AS "targetName",
            u.avatar AS "targetAvatar",
            'user' AS "targetType"
        FROM "user" u
        JOIN "is_friend" f
            ON (f."userID1" = u.id AND f."userID2" = $1)
            OR (f."userID1" = $1 AND f."userID2" = u.id)
        WHERE u.username ILIKE $2
        ORDER BY "targetName" ASC
    `;
        const values = [currentUserId, `%${username}%`]; // `$1` is currentUserId, `$2` is the partial name
        const listTarget = await UserRepo.query(query, values);

        if (listTarget.length == 0) {
            return res.status(404).json({
                success: false,
                message: 'The name not found in your friends list! Please try again.',
            });
        }

        res.status(200).json({
            success: true,
            listTarget,
        }); // Return paginated messages to the client
    } catch (error) {
        console.error('Error fetching messages: ', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching messages',
        });
    }
};

/**
 * @swagger
 * /chat/search-only-user:
 *   post:
 *     summary: Search for users in your friends list
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Chat
 *     requestBody:
 *       description: Username to search for
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *     responses:
 *       "200":
 *         description: A list of users has been retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 listTarget:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       targetId:
 *                         type: string
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       targetName:
 *                         type: string
 *                         example: "john_doe"
 *                       targetAvatar:
 *                         type: string
 *                         example: "http://example.com/avatar.jpg"
 *                       targetType:
 *                         type: string
 *                         example: "user"
 *       "404":
 *         description: The name not found in your friends list.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "The name not found in your friends list! Please try again."
 *       "500":
 *         description: An internal server error occurred, please try again.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error fetching messages"
 */
