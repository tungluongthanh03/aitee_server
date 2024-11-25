import { PostRepo } from '../../models/index.js';
import { validateGetPosts } from '../../validators/post.validator.js';

export const getPosts = async (req, res) => {
    try {
        const { error } = validateGetPosts(req.query);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit;

        let posts = await PostRepo.find({
            take: limit,
            skip,
            order: {
                createdAt: 'DESC',
            },
            relations: ['reactions'],
        });

        // update the number of views
        posts.forEach(async (post) => {
            post.nViews += 1;
            await PostRepo.save(post);
        });

        // remove the reactions from the response and add the number of reactions
        posts = posts.map((post) => {
            return {
                ...post,
                nReactions: post.reactions.length,
                reactions: undefined,
            };
        });

        return res.status(200).json({
            posts,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: 'An internal server error occurred, please try again.' });
    }
};
