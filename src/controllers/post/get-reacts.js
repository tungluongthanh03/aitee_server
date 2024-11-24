import { PostRepo, ReactRepo } from '../../models/index.js';
import { validateGetReacts } from '../../validators/post.validator.js';

export const getReacts = async (req, res) => {
    try {
        const { error } = validateGetReacts(req.query);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const post = await PostRepo.findOne({
            where: {
                id: req.params.id,
            },
        });

        if (!post) {
            return res.status(404).json({
                error: 'Post not found.',
            });
        }

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit;

        const reactions = await ReactRepo.find({
            where: {
                post: post,
            },
            order: {
                createdAt: 'DESC',
            },
            relations: ['user'],
            take: limit,
            skip,
        });

        return res.status(200).json({
            reactions,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: 'An internal server error occurred, please try again.' });
    }
};
