import { GroupChatRepo, UserRepo } from '../../models/index.js';

export default async (req, res) => {
    const { groupID } = req.body;
    const currentUserId = req.user.id; // Assuming you're getting the current user's ID from a session or token

    try {
        const group = await GroupChatRepo.findOne({ where: { groupID }, relations: ['has'] });
        const user = await UserRepo.findOne({ where: { id: currentUserId } });

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found',
            });
        }
        group.has = group.has.filter((user) => user.id !== currentUserId);

        // Save the group chat to the database
        const savedGroupChat = await GroupChatRepo.save(group);

        res.status(200).json({
            success: true,
            groupChat: savedGroupChat,
        });
    } catch (error) {
        console.error('Error leave group: ', error);
        res.status(500).json({
            success: false,
            message: 'Error leave group: ',
            error,
        });
    }
};
