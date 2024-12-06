import { UserRepo } from '../../models/index.js';

export const getFriendList = async (userId) => {
    try {
        const list = await UserRepo.query(
            `SELECT 
                u.ID AS "targetId",
                u.username AS "targetName",
                u.avatar AS "targetAvatar"
            FROM 
                is_friend f
            JOIN 
                "user" u 
            ON 
                (f."userID1" = u.ID OR f."userID2" = u.ID)
            WHERE 
                (f."userID1" = $1 OR f."userID2" = $1)
                AND u.ID != $1;
            `,
            [userId],
        );
        return list;
    } catch (error) {
        console.error('Error fetching list: ', error);
        return [];
    }
};
