import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';

import { specs, swaggerConfig } from '../config/index.js';

import user from './user.js';
import friend from './friend.js';
import post from './post.js';
import chat from './chat.js';

const router = express.Router();

const specDoc = swaggerJsdoc(swaggerConfig);
router.use(specs, serve);
router.get(specs, setup(specDoc, { explorer: true }));

router.use('/user', user);
router.use('/friend', friend);

router.use('/post', post);
router.use('/chat', chat);

export default router;
