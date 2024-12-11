import { GroupChatRepo, UserRepo } from '../../models/index.js';

export default async (req, res) => {
    const { groupId } = req.query;
    const userId = req.user.id;

    try {
        const group = await GroupChatRepo.findOne({ where: { groupID: groupId }, relations: ['has'] });
        if(!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found',
            });
        }

        const isMember = group.has.some((user) => user.id === userId);
        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: 'You are not a member of this group',
            });
        }


        const members = await UserRepo.query(
            `SELECT 
                u.id AS userId,
                u.username,
                u.avatar
            FROM 
                "groupChat_user" gcu
            JOIN 
                "users" u 
                ON gcu."userID" = u.id
            WHERE 
                gcu."groupID" = $1;
            `,
            [groupId],
        );

        res.status(200).json({
            success: true,
            list: members,
        }); // Return paginated messages to the client
    } catch (error) {
        console.error('Error fetching messages: ', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
};
