import { UserRepo } from '../../models/index.js';
import { RequestRepo } from '../../models/index.js';

export default async (req, res) => {
    try {
        const requestID = req.params.requestID;
        const request = await RequestRepo.findOneBy({ requestID });
        if (!request) {
            return res.status(400).json({ message: 'The friend request is invalid.' });
        }
        if (request.status == true) {
            return res.status(400).json({ message: 'The friend request already accept.' });
        }
        const recieverID = request.reciever;
        const senderID = request.sender;

        request.status = true;
        await RequestRepo.save(request);

        const requestResponse = await RequestRepo.create({
            sender: recieverID,
            user: { id: senderID },
            status: true,
        });
        await RequestRepo.save(requestResponse);

        res.status(200).json({
            message: 'The friend request has been successfully accepted.',
            request: {
                requestID: request.requestID,
                sender: request.sender,
                userOwner: request.id,
                status: request.status,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An internal server error occurred, please try again.' });
    }
};
