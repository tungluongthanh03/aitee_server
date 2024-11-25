import jwt from 'jsonwebtoken';

import { jwtSecretKey } from '../../config/index.js';
import { UserRepo } from '../../models/index.js';

const { verify } = jwt;

export default async (req, res, next) => {
    let token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided' });

    if (token.startsWith('Bearer ')) {
        token = req.header('Authorization').split(' ')[1];
    } else {
        return res.status(401).json({ error: 'Invalid token. Token must be a Bearer token' });
    }

    try {
        req.user = verify(token, jwtSecretKey);
<<<<<<< HEAD

=======
>>>>>>> 2c4d49b (Initial commit)
        const exists = await UserRepo.exists({ where: { id: req.user.id } }).catch((err) => {
            return res.status(500).json({ error: err.message });
        });

        if (!exists)
            return res.status(400).json({
                error: 'Could not find verified user with the given token and id. Be sure that the account was verified and activated.',
            });

        next();
    } catch (err) {
<<<<<<< HEAD
=======
        console.log(err);
>>>>>>> 2c4d49b (Initial commit)
        return res.status(401).json({ error: 'Invalid token. the token may have expired.' });
    }
};
