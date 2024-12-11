import { io } from '../../index.js';
import { GroupChatRepo, UserRepo } from '../../models/index.js';
import { onlineUsers } from '../../services/socket/index.js';

export default async (req, res) => {
    const { listUserIds, name } = req.body;
    const currentUserId = req.user.id; // Assuming you're getting the current user's ID from a session or token

    try {
        const creator = await UserRepo.findOne({ where: { id: currentUserId } });
        const users = await UserRepo.findByIds(listUserIds);

        // Create a new GroupChat entity
        const groupChat = GroupChatRepo.create({
            name: name,
            createBy: creator, // Associate the creator
            has: users, // Associate users with the group
        });

        // Save the group chat to the database
        const savedGroupChat = await GroupChatRepo.save(groupChat);

        // Return the newly created group chat with relations populated
        const newGroupChat = await GroupChatRepo.findOne({
            where: { groupID: savedGroupChat.groupID },
            relations: ['createBy', 'has'], // Include related data (creator and users)
        });

        res.status(200).json({
            success: true,
            groupChat: newGroupChat,
        });

        newGroupChat.has.forEach((user) => {
            // Emit a 'new-group' event to each user in the group
            const userSocketId = onlineUsers.get(user.id);
            io.to(userSocketId).emit('new-group', newGroupChat);
        })

    } catch (error) {
        console.error('Error creating group: ', error);
        res.status(500).json({
            success: false,
            message: 'Error creating group',
        });
    }
};

/**
 * @swagger
 * /chat/create-group:
 *   post:
 *     summary: Create a new group chat
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Chat
 *     requestBody:
 *       description: List of user IDs and group name
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               listUserIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *               name:
 *                 type: string
 *                 example: "Group Chat Name"
 *     responses:
 *       "200":
 *         description: Group chat created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 groupChat:
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
 *       "400":
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid input data."
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
