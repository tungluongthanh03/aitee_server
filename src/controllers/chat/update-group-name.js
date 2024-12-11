import { io } from '../../index.js';
import { GroupChatRepo, UserRepo } from '../../models/index.js';
import { uploadMedia } from '../../services/cloudinary/index.js';
import { onlineUsers } from '../../services/socket/index.js';

export default async (req, res) => {
    let { groupID, name } = req.body;
    const currentUserId = req.user.id; // Assuming you're getting the current user's ID from a session or token

    try {
        if(!name) return res.status(400).json({message: 'Group name is required'});
        const group = await GroupChatRepo.findOne({ where: { groupID }, relations: ['has'] });

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found',
            });
        }

        const isMember = group.has.some((user) => user.id === currentUserId);
        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: 'You are not a member of this group',
            });
        }

        group.name = name;

        // Save the group chat to the database
        const savedGroupChat = await GroupChatRepo.save(group);

        res.status(200).json({
            success: true,
            groupChat: savedGroupChat,
        });

        savedGroupChat.has.forEach((user) => {
            const userSocket = onlineUsers.get(user.id);
            if (userSocket) {
                io.to(userSocket).emit('update-group-name', savedGroupChat);
            }
        })
    } catch (error) {
        console.error('Error updating group name: ', error);
        res.status(500).json({
            success: false,
            message: 'Error updating group name: ',
            error,
        });
    }
};
