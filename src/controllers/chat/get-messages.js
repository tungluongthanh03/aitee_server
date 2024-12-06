import { MessageRepo } from '../../models/index.js';

export default async (req, res) => {
    const { userId } = req.query;
    const currentUserId = req.user.id; // Assuming you're getting the current user's ID from a session or token
    const limit = parseInt(req.query.limit) || 20; // Default to 20 messages
    const offset = parseInt(req.query.offset) || 0; // Default to 0 (most recent messages)

    try {
        const messages = await MessageRepo.query(
            `SELECT * FROM (
             SELECT * FROM message 
             WHERE ("sendFrom" = $1 AND "sendToUser" = $2) 
             OR ("sendFrom" = $2 AND "sendToUser" = $1) 
             OR "sendToGroupChat" = $2
             ORDER BY "createdAt" DESC  -- Get the latest messages first
             LIMIT $3 OFFSET $4         -- Apply pagination
         ) subquery
         ORDER BY "createdAt" ASC;     -- Reorder them chronologically`,
            [currentUserId, userId, limit, offset],
        );
        res.status(200).json({
            success: true,
            messages,
        }); // Return paginated messages to the client
    } catch (error) {
        console.error('Error fetching messages: ', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
};

/**
 * @swagger
 * /chat/messages:
 *   get:
 *     summary: Get a list of messages
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Chat
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user or group chat to retrieve messages for
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: Number of messages per page
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         required: false
 *         description: Offset for pagination
 *     responses:
 *       "200":
 *         description: A list of messages has been retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       messageID:
 *                         type: string
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       sendFrom:
 *                         type: string
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       sendToUser:
 *                         type: string
 *                         example: "123e4567-e89b-12d3-a456-426614174001"
 *                       sendToGroupChat:
 *                         type: string
 *                         example: "123e4567-e89b-12d3-a456-426614174002"
 *                       content:
 *                         type: string
 *                         example: "This is a sample message."
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-01-01T00:00:00Z"
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
