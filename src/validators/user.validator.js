import Joi from 'joi';

export function validateQueryUsers(query) {
    const schema = Joi.object({
        page: Joi.number().min(1).required(),
        limit: Joi.number().min(1).required(),
    });
    return schema.validate(query);
}

export function validateRegister(body) {
    const schema = Joi.object({
        email: Joi.string().email().max(100).required(),
        phoneNumber: Joi.string().min(10).max(15).required(),
        password: Joi.string().min(6).max(100).required(),
        firstName: Joi.string().min(2).max(15).required(),
        lastName: Joi.string().min(2).max(30).required(),
        sex: Joi.string().valid('male', 'female', 'other').required(),
        birthday: Joi.date().required(),
    });
    return schema.validate(body);
}

export function validateLogin(body) {
    const schema = Joi.object({
        email: Joi.string().email().max(100).required(),
        password: Joi.string().min(6).max(100).required(),
    });
    return schema.validate(body);
}

export function validateRefreshToken(body) {
    const schema = Joi.object({
        refreshToken: Joi.string().min(10).required(),
    });
    return schema.validate(body);
}

export function validateForgotPassword(body) {
    const schema = Joi.object({
        password: Joi.string().min(6).max(100).required(),
    });
    return schema.validate(body);
}

export function validateChangePassword(body) {
    const schema = Joi.object({
        newPassword: Joi.string().min(6).max(100).required(),
    });
    return schema.validate(body);
}

export function validateEditUser(body) {
    const schema = Joi.object({
        username: Joi.string().min(3).max(20),
        firstName: Joi.string().min(2).max(15),
        lastName: Joi.string().min(2).max(30),
        birthday: Joi.date(),
        address: Joi.string().min(5).max(255),
        biography: Joi.string().min(5).max(255),
    });
    return schema.validate(body);
}
