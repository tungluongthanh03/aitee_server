import { NotificationRepo } from '../../models/index.js';

export default async (req, res) => {
    try {
        const notificationId = req.params.id;
        const notification = await NotificationRepo.findOne({
            where: { id: notificationId, user: { id: req.user.id } },
        });

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found.' });
        }

        notification.status = !notification.status;

        await NotificationRepo.save(notification);
        return res.status(200).json({ notification });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

/**
 * @swagger
 * /notification/{id}:
 *   put:
 *     summary: Mark a notification as read or unread
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Notification
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the notification to mark as read or unread
 *     responses:
 *       "200":
 *         description: Notification status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notification:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     status:
 *                       type: boolean
 *                       example: true
 *                     userId:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T00:00:00Z"
 *       "404":
 *         description: Notification not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Notification not found."
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
