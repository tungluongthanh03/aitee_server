import { Router } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';

import { specs, swaggerConfig } from '../config/index.js';
import user from './user.js';
import friend from './friend.js';
import post from './post.js';
import notification from './notification.js';
import report from './report.js';
import chat from './chat.js';

const router = Router();

// Swagger Docs
const specDoc = swaggerJsdoc(swaggerConfig);
router.use(specs, serve);
router.get(specs, setup(specDoc, { explorer: true }));

// Routes
router.use('/user', user);
router.use('/friend', friend);
router.use('/post', post);
router.use('/notification', notification);
router.use('/report', report);
router.use('/chat', chat);

export default router;
