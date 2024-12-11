// import { io } from '../../index.js';
import { io } from '../../index.js';
import { GroupChatRepo, MessageRepo, UserRepo } from '../../models/index.js';
// import { onlineUsers } from '../../services/socket/index.js';

export default async (req, res) => {
    const { groupID } = req.body;
    const currentUserId = req.user.id; // Assuming you're getting the current user's ID from a session or token

    try {
        const group = await GroupChatRepo.findOne({
            where: { groupID },
            relations: ['has', 'createBy'],
        });

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found',
            });
        }

        // Check if the current user is the creator of the group
        if (group.createBy.id !== currentUserId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to dissolve this group',
            });
        }

        await MessageRepo.delete({ sendToGroupChat: groupID });

        // Remove the group from the database
        await GroupChatRepo.remove(group);

        res.status(200).json({
            success: true,
            message: 'Group successfully dissolved',
        });

        io.to(groupID).emit('dissolve-group', {...group, groupID});
    } catch (error) {
        console.error('Error dissolve group: ', error);
        res.status(500).json({
            success: false,
            message: 'Error dissolve group: ',
        });
    }
};
