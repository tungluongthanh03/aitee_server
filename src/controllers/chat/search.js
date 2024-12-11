import { MessageRepo, UserRepo } from '../../models/index.js';

export default async (req, res) => {
    const { username } = req.body;
    const currentUserId = req.user.id; // Assuming you're getting the current user's ID from a session or token

    try {
        const query = `
        (
            SELECT 
                u.id AS "targetId",
                u.username AS "targetName",
                u.avatar AS "targetAvatar",
                'user' AS "targetType"
            FROM "users" u
            JOIN "friends" f
                ON (f."acceptorId" = u.id AND f."acceptedId" = $1)
                OR (f."acceptorId" = $1 AND f."acceptedId" = u.id)
            WHERE u.username ILIKE $2
        )
        UNION
        (
            SELECT 
                g."groupID" AS "targetId",
                g.name AS "targetName",
                g.avatar AS "targetAvatar",
                'group' AS "targetType"
            FROM "group_chat" g
            JOIN "groupChat_user" gm
                ON gm."groupID" = g."groupID"
            WHERE gm."userID" = $1
            AND g.name ILIKE $2
        )
        ORDER BY "targetName" ASC
    `;
        const values = [currentUserId, `%${username}%`]; // `$1` is currentUserId, `$2` is the partial name
        const listTarget = await UserRepo.query(query, values);

        if (listTarget.length == 0) {
            return res.status(404).json({
                success: false,
                message: 'The name not found in your friends list or groups! Please try again.',
            });
        }

        res.status(200).json({
            success: true,
            listTarget,
        }); // Return paginated messages to the client
    } catch (error) {
        console.error('Error fetching messages: ', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching messages',
        });
    }
};
