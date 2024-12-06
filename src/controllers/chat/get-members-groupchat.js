import { UserRepo } from '../../models/index.js';

export default async (req, res) => {
    const { groupId } = req.query;

    try {
        const members = await UserRepo.query(
            `SELECT 
                u.id AS userId,
                u.username,
                u.avatar
            FROM 
                "groupChat_user" gcu
            JOIN 
                "user" u 
                ON gcu."userID" = u.id
            WHERE 
                gcu."groupID" = $1;
            `,
            [groupId],
        );

        res.status(200).json({
            success: true,
            list: members,
        }); // Return paginated messages to the client
    } catch (error) {
        console.error('Error fetching messages: ', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
};

/**
 * @swagger
 * /chat/group-members:
 *   get:
 *     summary: Get a list of group chat members
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Chat
 *     parameters:
 *       - in: query
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the group chat to retrieve members for
 *     responses:
 *       "200":
 *         description: A list of group chat members has been retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 list:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       username:
 *                         type: string
 *                         example: "john_doe"
 *                       avatar:
 *                         type: string
 *                         example: "http://example.com/avatar.jpg"
 *       "500":
 *         description: An internal server error occurred, please try again.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching messages"
 */
