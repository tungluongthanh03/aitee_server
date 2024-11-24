import { PostRepo, ReactRepo } from '../../models/index.js';

export const react = async (req, res) => {
    try {
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

        const reaction = await ReactRepo.findOne({
            where: {
                post: post,
                user: req.user,
            },
        });

        if (reaction) {
            await ReactRepo.remove(reaction);

            return res.status(200).json({
                message: 'Reaction removed successfully.',
            });
        }

        const react = ReactRepo.create({
            post: post,
            user: req.user,
        });

        await ReactRepo.save(react);

        return res.status(200).json({
            message: 'Reaction updated successfully.',
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: 'An internal server error occurred, please try again.' });
    }
};
