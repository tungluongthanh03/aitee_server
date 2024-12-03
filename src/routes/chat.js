import { Router } from 'express';

import { getConversations, getMembers, getMessages, search, searchOnlyUser } from '../controllers/chat/index.js';
import { auth, imageUpload, checkAdmin } from '../middlewares/index.js';
import createGroup from '../controllers/chat/create-group.js';
import getGroupDetails from '../controllers/chat/get-group-details.js';

const router = Router();


// Require chat routes
router.get('/conversations', auth,  getConversations);
router.get('/messages', auth, getMessages);
router.get('/members', auth, getMembers);
router.get("/group-details", auth, getGroupDetails);

// router.post('/new-chat', auth, newChat);
router.post('/search', auth, search);
router.post('/search-only-user', auth, searchOnlyUser);
router.post('/create-group', auth, createGroup);


export default router;
