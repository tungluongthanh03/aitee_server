import { NotificationRepo } from '../../models/index.js';
import { validateGetNotifications } from '../../validators/notification.validator.js';

export default async (req, res) => {
    try {
        const { error } = validateGetNotifications(req.query);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit;

        let [notifications, total] = await NotificationRepo.findAndCount({
            where: { user: { id: req.user.id } },
            take: limit,
            skip,
            order: { createdAt: 'DESC' },
            relations: [
                'reactNotification',
                'commentNotification',
                'friendNotification',
                'systemNotification',
            ],
        });

        notifications = notifications.map((notification) => {
            return {
                id: notification.id,
                status: notification.status,
                createdAt: notification.createdAt,
                reactNotification: notification.reactNotification || undefined,
                commentNotification: notification.commentNotification || undefined,
                friendNotification: notification.friendNotification || undefined,
                systemNotification: notification.systemNotification || undefined,
            };
        });

        return res.status(200).json({ notifications, total });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

/**
 * @swagger
 * /notification:
 *   get:
 *     summary: Get a list of notifications
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Notification
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Number of notifications per page
 *     responses:
 *       "200":
 *         description: A list of notifications has been retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       type:
 *                         type: string
 *                         example: "react"
 *                       message:
 *                         type: string
 *                         example: "User X reacted to your post."
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       reactNotification:
 *                         type: object
 *                         nullable: true
 *                       commentNotification:
 *                         type: object
 *                         nullable: true
 *                       friendNotification:
 *                         type: object
 *                         nullable: true
 *                       systemNotification:
 *                         type: object
 *                         nullable: true
 *                 total:
 *                   type: integer
 *                   example: 10
 *       "400":
 *         description: Invalid query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid query parameters."
 *       "500":
 *         description: An internal server error occurred, please try again.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An internal server error occurred, please try again."
 */
