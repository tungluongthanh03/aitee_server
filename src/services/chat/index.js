import { GroupChatRepo, MessageRepo } from '../../models/index.js';

export const storeMessage = async (message) => {
    const query = `
    WITH inserted_message AS (
    INSERT INTO message (content, "sendFrom", "sendToUser", "sendToGroupChat", "createdAt")
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
)
SELECT 
    im.*,
    CASE
        WHEN im."sendToUser" IS NOT NULL THEN u."username"
        ELSE NULL
    END as username,
    CASE
        WHEN im."sendToUser" IS NOT NULL THEN u."avatar"
        ELSE NULL
    END AS "userAvatar",
    CASE
        WHEN im."sendToGroupChat" IS NOT NULL THEN g."name"
        ELSE NULL
    END as "groupName",
    CASE
        WHEN im."sendToGroupChat" IS NOT NULL THEN g."avatar"
        ELSE NULL
    END AS "groupChatAvatar"
FROM 
    inserted_message im
LEFT JOIN 
    "user" u ON u."id" = im."sendFrom"
LEFT JOIN 
    "group_chat" g ON g."groupID" = im."sendToGroupChat";

`;

    const values = [
        message.content,
        message.sendFrom,
        message.sendToUser || null, // Use NULL if sendToUser is not provided
        message.sendToGroupChat || null, // Use NULL if sendToGroupChat is not provided
        new Date(), // Current timestamp
    ];

    try {
        const result = await MessageRepo.query(query, values);
        console.log(result);
        return result[0]; // Return the inserted message along with additional information
    } catch (error) {
        console.error('Error storing message:', error);
        return null;
    }
};

export const getGroups = async (userId) => {
    const query = `
    SELECT 
        g."groupID",
        g.name,
        g.avatar,
        g."createdAt"
    FROM 
        "group_chat" g
    JOIN 
        "groupChat_user" gm ON gm."groupID" = g."groupID"
    WHERE 
        gm."userID" = $1;
`;

    const values = [userId];

    try {
        return await GroupChatRepo.query(query, values);
    } catch (error) {
        console.error('Error fetching groups:', error);
        return [];
    }
};
