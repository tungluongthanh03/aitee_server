import { io } from '../../index.js';
import { GroupChatRepo, UserRepo } from '../../models/index.js';
import { onlineUsers } from '../../services/socket/index.js';

export default async (req, res) => {
    const { groupID, memberId } = req.body;
    const currentUserId = req.user.id; // Assuming you're getting the current user's ID from a session or token

    try {
        const group = await GroupChatRepo.findOne({ where: { groupID }, relations: ['has'] });
        const member = await UserRepo.findOne({ where: { id: memberId} });

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found',
            });
        }

        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Member not found',
            });
        }

        const isMember = group.has.some((user) => user.id === currentUserId);
        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: 'You are not a member of this group',
            });
        }

        // Check if the user is not in the group
        const alreadyIsMember = group.has.some((user) => user.id === memberId);
        if (!alreadyIsMember) {
            return res.status(403).json({
                success: false,
                message: 'This user is not a member of this group',
            });
        }

        // Remove the user from the group
        group.has = group.has.filter((user) => user.id !== memberId);

        // Save the group chat to the database
        const savedGroupChat = await GroupChatRepo.save(group);

        io.to(groupID).emit('remove-member', { group: savedGroupChat });
        const removedMember = onlineUsers.get(memberId);
        if(removedMember) {
            io.to(removedMember).emit('removed-from-group', savedGroupChat);
        }

        res.status(200).json({
            success: true,
            groupChat: savedGroupChat,
        });
    } catch (error) {
        console.error('Error remove member: ', error);
        res.status(500).json({
            success: false,
            message: 'Error remove member: ',
            error,
        });
    }
};
