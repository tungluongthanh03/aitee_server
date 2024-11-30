import { UserRepo } from '../../models/index.js';
import { deleteMedia } from '../../services/cloudinary/index.js';

export default async (req, res) => {
    try {
        const id = req.user.id;
        const user = await UserRepo.findOneBy({ id });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.image) {
            await deleteMedia(user.image, 'image');
        }
        await UserRepo.delete(user.id);

        res.status(200).json({ message: 'Your account was deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An internal server error occurred, please try again.' });
    }
};

/**
 * @swagger
 * /user/delete:
 *   delete:
 *     summary: Delete the authenticated user's account
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Your account was deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your account was deleted successfully.
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: An internal server error occurred, please try again.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An internal server error occurred, please try again.
 */
