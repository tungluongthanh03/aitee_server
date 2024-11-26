import { RequestRepo } from '../../models/index.js';
import { UserRepo } from '../../models/index.js';

export default async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserRepo.findOneBy({ id });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const offset = (page - 1) * limit;

        const [list, countFriends] = await RequestRepo.findAndCount({
            where: {
                user: { id: user.id },
                status: true,
            },
            take: limit,
            skip: offset,
        });
        const totalPages = Math.ceil(countRequests / limit);

        if (page > totalPages) {
            return res.status(400).json({
                message: 'Requested page exceeds total pages.',
                totalPages,
                currentPage: page,
            });
        }
        res.status(200).json({
            message: 'Friend requests fetched successfully.',
            data: {
                list,
                countFriends,
                totalPages,
                currentPage: page,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An internal server error occurred, please try again.' });
    }
};
