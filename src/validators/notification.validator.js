import Joi from 'joi';

export function validateGetNotifications(query) {
    const schema = Joi.object({
        page: Joi.number().min(1).required(),
        limit: Joi.number().min(1).required(),
    });

    return schema.validate(query);
}
