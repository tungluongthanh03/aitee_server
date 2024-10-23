import { UserRepo } from '../../models/index.js';
import { validateQueryUsers } from '../../validators/user.validator.js';

export default async (req, res) => {
    try {
        const { error } = validateQueryUsers(req.query);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit;

        const totalUsers = await UserRepo.count();

        const users = await UserRepo.find({
            skip,
            take: limit,
            select: {
                password: false,
            },
        });

        return res.status(200).json({ total: totalUsers, length: users.length, users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An internal server error occurred, please try again.' });
    }
};
