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

        await NotificationRepo.remove(notification);
        return res.status(200).json({ message: 'Notification removed successfully.' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

/**
 * @swagger
 * /notification/{id}:
 *   delete:
 *     summary: Remove a notification by ID
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
 *         description: The ID of the notification to remove
 *     responses:
 *       "200":
 *         description: Notification removed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notification removed successfully.
 *       "404":
 *         description: Notification not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Notification not found.
 *       "500":
 *         description: An internal server error occurred, please try again.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An internal server error occurred, please try again.
 */
