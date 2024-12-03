import { GroupChatRepo, UserRepo } from '../../models/index.js';

export default async (req, res) => {
    const { groupId } = req.query;

    try {
        const details = await GroupChatRepo.findOne({
            where: { groupID: groupId },
            relations: ['createBy', 'has'],
        });
        console.log(details);
        res.status(200).json({
            success: true,
            details,
        }); // Return paginated messages to the client
    } catch (error) {
        console.error('Error fetching messages: ', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
};
