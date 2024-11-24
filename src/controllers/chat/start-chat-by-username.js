import { MessageRepo, UserRepo } from '../../models/index.js';

export default async (req, res) => {
    const { username } = req.body;
    const currentUserId = req.user.id; // Assuming you're getting the current user's ID from a session or token

    try {
        const user = await UserRepo.query(
            `
        SELECT u.id, u.username, u.avatar
        FROM "user" u
        JOIN "is_friend" f
            ON (f."userID1" = u.id AND f."userID2" = $1)
            OR (f."userID1" = $1 AND f."userID2" = u.id)
        WHERE u.username = $2
    `,
            [currentUserId, username],
        );


        if (user.length == 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found in your friends list! Please try again.',
            });
        }

        res.status(200).json({
            success: true,
            user,
        }); // Return paginated messages to the client
    } catch (error) {
        console.error('Error fetching messages: ', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching messages',
        });
    }
};
