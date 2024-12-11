import { io } from '../../index.js';
import { GroupChatRepo, UserRepo } from '../../models/index.js';
import { onlineUsers } from '../../services/socket/index.js';

export default async (req, res) => {
    const { groupID, memberIds } = req.body;
    console.log(req.body);
    const currentUserId = req.user.id; // Assuming you're getting the current user's ID from a session or token

    try {
        if (!Array.isArray(memberIds) || memberIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid array of member IDs',
            });
        }

        const group = await GroupChatRepo.findOne({ where: { groupID }, relations: ['has'] });
        const members = await UserRepo.findByIds(memberIds);

        console.log(group);
        console.log(members);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found',
            });
        }

        if (members.length !== memberIds.length) {
            return res.status(404).json({
                success: false,
                message: 'Some users in the provided member IDs do not exist',
            });
        }

        const isMember = group.has.some((user) => user.id === currentUserId);
        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: 'You are not a member of this group',
            });
        }

        // Check if the user is already in the group
        const newMembers = members.filter(
            (member) => !group.has.some((user) => user.id === member.id)
        );

        if (newMembers.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'All provided users are already members of the group',
            });
        }

        group.has = [...group.has, ...newMembers];

        // Save the group chat to the database
        const savedGroupChat = await GroupChatRepo.save(group);
        
        // Notify the new members
        newMembers.forEach((member) => {
            const memberSocketId = onlineUsers.get(member.id); // Lookup member's socket ID
            if(memberSocketId) {
                io.to(memberSocketId).emit('added-to-group', {
                    group: savedGroupChat,
                });
            }
        });

        res.status(200).json({
            success: true,
            groupChat: savedGroupChat,
        });
    } catch (error) {
        console.error('Error add members: ', error);
        res.status(500).json({
            success: false,
            message: 'Error add members: ',
            error,
        });
    }
};
