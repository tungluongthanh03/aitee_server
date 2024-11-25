import Joi from 'joi';

export function validateComment(body) {
    const schema = Joi.object({
        content: Joi.string().max(500).required().messages({
            'string.empty': 'Content is required.',
            'string.max': 'Content cannot exceed 500 characters.',
        }),
    });

    return schema.validate(body);
}
