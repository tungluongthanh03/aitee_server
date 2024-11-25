import { RequestRepo } from '../../models/index.js';
import { UserRepo } from '../../models/index.js';

export default async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserRepo.findOneBy({ id });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const list = await RequestRepo.find({
            where: {
                user: { id: user.id },
                status: true,
            },
        });

        res.json(list);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An internal server error occurred, please try again.' });
    }
};
