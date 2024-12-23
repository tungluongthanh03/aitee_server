import Joi from 'joi';

export function validateCreateComment(body) {
    const schema = Joi.object({
        content: Joi.string().min(1).max(500).required().messages({
            'string.empty': 'Content is required.',
            'string.max': 'Content cannot exceed 500 characters.',
        }),
        rootComment: Joi.string().uuid().allow(null),
    });

    return schema.validate(body);
}

export function validateUpdateComment(body) {
    const schema = Joi.object({
        content: Joi.string().min(1).max(500).messages({
            'string.empty': 'Content is required.',
            'string.max': 'Content cannot exceed 500 characters.',
        }),
    });

    return schema.validate(body);
}

export function validateGetComments(query) {
    const schema = Joi.object({
        page: Joi.number().min(1).required(),
        limit: Joi.number().min(1).required(),
    });

    return schema.validate(query);
}