import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';

import { specs, swaggerConfig } from '../config/index.js';


import user from './user.js';
import comment from './comment.js';
import friend from './friend.js';

const router = express.Router();

const specDoc = swaggerJsdoc(swaggerConfig);
router.use(specs, serve);
router.get(specs, setup(specDoc, { explorer: true }));

router.use('/user', user);

router.use('/comment', comment);
router.use('/friend', friend);

export default router;
