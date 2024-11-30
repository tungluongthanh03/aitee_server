import { UserRepo } from '../../models/index.js';
import { deleteMedia } from '../../services/cloudinary/index.js';

export default async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserRepo.findOneBy({ id });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.image) {
            await deleteMedia(user.image, 'image');
        }
        await UserRepo.delete(user.id);

        res.status(200).json({ message: `User with id ${id} was deleted successfully.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An internal server error occurred, please try again.' });
    }
};

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     security:
 *        - bearerAuth: []
 *     description: Deletes a user from the database by their ID.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User with id {id} was deleted successfully.
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
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An internal server error occurred, please try again.
 */
