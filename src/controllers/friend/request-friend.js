import { UserRepo } from '../../models/index.js';
import { RequestRepo } from '../../models/index.js';

export default async (req, res) => {
    try {
        const id = req.params.id;
        const senderID = req.user.id;
        const reciever = await UserRepo.findOneBy({ id });
        const sender = await UserRepo.findOneBy({ senderID });
        if (!reciever) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingRequest = await RequestRepo.findOne({
            where: {
                sender: senderID,
                user: { id: reciever.id },
            },
        });
        if (existingRequest) {
            return res.status(400).json({ message: 'The friend request already exists' });
        }

        const request = await RequestRepo.create({
            sender: sender.id,
            user: reciever,
        });

        await RequestRepo.save(request);

        res.status(200).json({
            message: 'Added friend successfully',
            request: {
                sender: req.user.id,
                user: { id: reciever.id },
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An internal server error occurred, please try again.' });
    }
};
