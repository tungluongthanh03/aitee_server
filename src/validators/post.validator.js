import Joi from 'joi';

export function validateCreatePost(body) {
    const schema = Joi.object({
        content: Joi.string().min(1).max(255).required(),
    });

    return schema.validate(body);
}

export function validateUpdatePost(body) {
    const schema = Joi.object({
        content: Joi.string().min(1).max(255),
    });

    return schema.validate(body);
}

export function validateGetPosts(query) {
    const schema = Joi.object({
        page: Joi.number().min(1).required(),
        limit: Joi.number().min(1).required(),
    });

    return schema.validate(query);
}

export function validateGetReacts(query) {
    const schema = Joi.object({
        page: Joi.number().min(1).required(),
        limit: Joi.number().min(1).required(),
    });

    return schema.validate(query);
}
