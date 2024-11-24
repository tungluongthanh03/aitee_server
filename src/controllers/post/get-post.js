import { PostRepo } from '../../models/index.js';

export const getPost = async (req, res) => {
    try {
        const post = await PostRepo.findOne({
            where: {
                id: req.params.id,
            },
            relations: ['reactions'],
        });

        if (!post) {
            return res.status(404).json({
                error: 'Post not found.',
            });
        }

        console.log(post);

        post.nReactions = post.reactions.length;

        // update the number of views
        post.nViews += 1;
        await PostRepo.save(post);

        return res.status(200).json({
            post,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: 'An internal server error occurred, please try again.' });
    }
};
