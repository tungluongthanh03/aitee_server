import { Router } from 'express';

import {
    getConversations,
    getMembers,
    getMessages,
    search,
    searchOnlyUser,
    getBlock,
    removeMember,
    leaveGroup,
    dissolveGroup,
    updateGroupName,
    updateGroupAvatar,
} from '../controllers/chat/index.js';
import { auth, imageUpload } from '../middlewares/index.js';
import createGroup from '../controllers/chat/create-group.js';
import getGroupDetails from '../controllers/chat/get-group-details.js';
import addMembers from '../controllers/chat/add-members.js';

const router = Router();

// Require chat routes
router.get('/conversations', auth, getConversations);
router.get('/messages', auth, getMessages);
router.get('/members', auth, getMembers);
router.get('/group-details', auth, getGroupDetails);
router.get('/block', auth, getBlock);

router.post('/search', auth, search);
router.post('/search-only-user', auth, searchOnlyUser);
router.post('/create-group', auth, createGroup);
router.post('/add-members', auth, addMembers);
router.post('/remove-member', auth, removeMember);
router.post('/leave-group', auth, leaveGroup);
router.post('/dissolve-group', auth, dissolveGroup);
router.post('/update-group-avatar', auth, imageUpload.single('avatar'), updateGroupAvatar);
router.post('/update-group-name', auth, updateGroupName);

export default router;
