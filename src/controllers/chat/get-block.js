import { BlockRepo } from '../../models/index.js';

export default async (req, res) => {
    const { targetId } = req.query;
    const currentUserId = req.user.id;

    try {
        const block = await BlockRepo.findOne({
            where: [
                {
                    blocker: { id: currentUserId },
                    blocked: { id: targetId },
                },
                {
                    blocker: { id: targetId },
                    blocked: { id: currentUserId },
                },
            ]
        });
        res.status(200).json({
            success: true,
            block,
        }); // Return paginated messages to the client
    } catch (error) {
        console.error('Error fetching messages: ', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
};
