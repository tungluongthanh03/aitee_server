import { MessageRepo } from '../../models/index.js';

export default async (req, res) => {
    const currentUserId = req.user.id; // Assuming you're getting the current user's ID from a session or token
    
    const query = `
    WITH LatestMessages AS (
    SELECT DISTINCT ON (
        CASE 
            WHEN m."sendToGroupChat" IS NOT NULL THEN m."sendToGroupChat"
            ELSE LEAST(m."sendFrom", m."sendToUser")
        END,
        CASE 
            WHEN m."sendToGroupChat" IS NOT NULL THEN m."sendToGroupChat"
            ELSE GREATEST(m."sendFrom", m."sendToUser")
        END
    )
        m."messageID",
        CASE 
            WHEN m."sendToGroupChat" IS NOT NULL THEN 'group'
            ELSE 'user'
        END AS "targetType",
        CASE 
            WHEN m."sendToGroupChat" IS NOT NULL THEN m."sendToGroupChat"
            ELSE u."id"
        END AS "targetId",
        CASE 
            WHEN m."sendToGroupChat" IS NOT NULL THEN g."name"
            ELSE u."username"
        END AS "targetName",
        CASE 
            WHEN m."sendToGroupChat" IS NOT NULL THEN g."avatar"
            ELSE u."avatar"
        END AS "targetAvatar",
        m."content" AS "lastMessage",
        m."createdAt"
    FROM "message" m
    LEFT JOIN "user" u 
        ON u."id" = CASE 
                    WHEN m."sendFrom" = $1 THEN m."sendToUser"
                    ELSE m."sendFrom"
                   END
    LEFT JOIN "group_chat" g 
        ON g."groupID" = m."sendToGroupChat"
    WHERE m."sendFrom" = $1 
       OR m."sendToUser" = $1 
       OR m."sendToGroupChat" IN (
           SELECT gcu."groupID"
           FROM "groupChat_user" gcu
           WHERE gcu."userID" = $1
       )
    ORDER BY 
        CASE 
            WHEN m."sendToGroupChat" IS NOT NULL THEN m."sendToGroupChat"
            ELSE LEAST(m."sendFrom", m."sendToUser")
        END,
        CASE 
            WHEN m."sendToGroupChat" IS NOT NULL THEN m."sendToGroupChat"
            ELSE GREATEST(m."sendFrom", m."sendToUser")
        END,
        m."createdAt" DESC
)
SELECT *
FROM LatestMessages
ORDER BY "createdAt" DESC;

`;


    try {
        const conversations = await MessageRepo.query(query, [currentUserId]);
        return res.status(200).json({
            success: true,
            conversations,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({
                error: 'An internal server error occurred, please try again after a few minutes!',
            });
    }
};

/**
 * @swagger
 * /user/change-password:
 *    post:
 *      summary: Changes the Password
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          schema:
 *            type: string
 *          description: Put access token here
 *      requestBody:
 *        description: Old and new passwords
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                newPassword:
 *                  type: string
 *      tags:
 *        - User
 *      responses:
 *        "200":
 *          description: Your password was changed successfully.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 *        "400":
 *          description: Please provide old and new passwords that are longer than 6 letters and shorter than 20 letters.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 *        "401":
 *          description: Invalid token.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 *        "500":
 *          description: An internal server error occurred, please try again.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 */
