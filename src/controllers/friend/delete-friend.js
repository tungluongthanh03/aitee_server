import { RequestRepo } from '../../models/index.js';

export default async (req, res) => {
    try {
        const requestID = req.params.requestID;
        const request = await RequestRepo.findOneBy({ requestID });

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const requestOfFriend = await RequestRepo.findOne({
            where: {
                sender: request.reciever,
                reciever: request.sender,
            },
        });

        await RequestRepo.delete(request.requestID);
        await RequestRepo.delete(requestOfFriend.requestID);
        res.status(200).json({
            message: `Request with ID ${request.requestID} was deleted successfully.`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An internal server error occurred, please try again.' });
    }
};
