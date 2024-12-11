import { GroupChatRepo, UserRepo } from '../../models/index.js';

export default async (req, res) => {
    const { groupId } = req.query;

    try {
        const details = await GroupChatRepo.findOne({
            where: { groupID: groupId },
            relations: ['createBy', 'has'],
        });
        res.status(200).json({
            success: true,
            details,
        }); // Return paginated messages to the client
    } catch (error) {
        console.error('Error fetching messages: ', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
};

/**
 * @swagger
 * /chat/group-details:
 *   get:
 *     summary: Get group chat details
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
 *         description: The ID of the group chat to retrieve details for
 *     responses:
 *       "200":
 *         description: Group chat details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 details:
 *                   type: object
 *                   properties:
 *                     groupID:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     name:
 *                       type: string
 *                       example: "Group Chat Name"
 *                     createBy:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "123e4567-e89b-12d3-a456-426614174000"
 *                         username:
 *                           type: string
 *                           example: "john_doe"
 *                     has:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "123e4567-e89b-12d3-a456-426614174001"
 *                           username:
 *                             type: string
 *                             example: "jane_doe"
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
