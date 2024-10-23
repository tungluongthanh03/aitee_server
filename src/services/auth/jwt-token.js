import pkg from 'jsonwebtoken';

import { jwtSecretKey, refreshTokenSecretKey } from '../../config/index.js';

const { sign } = pkg;

export function signAccessToken(userId) {
    const accessToken = sign({ id: userId }, jwtSecretKey, {
        expiresIn: '1h',
    });
    return accessToken;
}

export function signRefreshToken(userId) {
    const refreshToken = sign({ id: userId }, refreshTokenSecretKey, {
        expiresIn: '7d',
    });
    return refreshToken;
}
