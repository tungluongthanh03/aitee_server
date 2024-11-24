import { Router } from 'express';

import { getConversations, getMessages, newChat } from '../controllers/chat/index.js';
import { auth, imageUpload, checkAdmin } from '../middlewares/index.js';

const router = Router();


// Require chat routes
router.get('/conversations', auth,  getConversations);
router.get('/messages/', auth, getMessages);

router.post('/new-chat', auth, newChat);


// Admin routes
// router.get('/users', auth, checkAdmin, getUsers);
// router.delete('/:id', auth, checkAdmin, deleteUserById);

export default router;
