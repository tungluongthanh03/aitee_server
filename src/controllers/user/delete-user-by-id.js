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
        res.status(500).json({ message: 'An internal server error occurred, please try again.' });
    }
};
