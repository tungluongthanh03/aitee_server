import { UserRepo } from '../../models/index.js';

export default async (req, res) => {
    const { groupId } = req.query;

    try {
        const members = await UserRepo.query(
            `SELECT 
                u.id AS userId,
                u.username,
                u.avatar
            FROM 
                "groupChat_user" gcu
            JOIN 
                "user" u 
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
