import { UserRepo } from '../../models/index.js';
import { RequestRepo } from '../../models/index.js';

export default async (req, res) => {
    try {
        const requestID = req.params.requestID;
        const request = await RequestRepo.findOneBy({ requestID });

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        await RequestRepo.delete(request.requestID);

        res.status(200).json({
            message: `Request with ID ${request.requestID} was denied successfully.`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An internal server error occurred, please try again.' });
    }
};
