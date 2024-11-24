import { MessageRepo } from '../../models/index.js';

export default async (req, res) => {
    const currentUserId = req.user.id; // Assuming you're getting the current user's ID from a session or token
    
    const query = `
            SELECT DISTINCT ON (LEAST(m."sendFrom", m."sendToUser"), GREATEST(m."sendFrom", m."sendToUser"))
    u."id" AS "userId",
    u."username",
    u."avatar",
    m."content" AS "lastMessage",
    m."createdAt"
FROM "message" m
JOIN "user" u
    ON u."id" = CASE
                   WHEN m."sendFrom" = $1 THEN m."sendToUser"
                   ELSE m."sendFrom"
                END
WHERE m."sendFrom" = $1 OR m."sendToUser" = $1
ORDER BY LEAST(m."sendFrom", m."sendToUser"),
         GREATEST(m."sendFrom", m."sendToUser"),
         m."createdAt" DESC;

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
