import { Router } from 'express';

import {
    getNotifications,
    readNotification,
    removeNotification,
} from '../controllers/notification/index.js';
import { auth } from '../middlewares/index.js';

const router = Router();

router.get('/', auth, getNotifications);
router.put('/:id', auth, readNotification);
router.delete('/:id', auth, removeNotification);

export default router;
