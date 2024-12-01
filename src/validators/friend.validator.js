import Joi from 'joi';

export function validateGetRequests(query) {
    const schema = Joi.object({
        page: Joi.number().min(1).required(),
        limit: Joi.number().min(1).required(),
    });

    return schema.validate(query);
}

export function validateGetFriends(query) {
    const schema = Joi.object({
        page: Joi.number().min(1).required(),
        limit: Joi.number().min(1).required(),
    });

    return schema.validate(query);
}

export function validateGetBlocks(query) {
    const schema = Joi.object({
        page: Joi.number().min(1).required(),
        limit: Joi.number().min(1).required(),
    });

    return schema.validate(query);
}
