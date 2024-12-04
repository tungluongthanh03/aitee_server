import { GroupChatRepo, UserRepo } from '../../models/index.js';

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
    } catch (error) {
        console.error('Error creating group: ', error);
        res.status(500).json({
            success: false,
            message: 'Error creating group',
        });
    }
};
