import { Router } from 'express';

import {
    requestFriend,
    acceptFriend,
    denyFriend,
    listFriend,
    listRequest,
    deleteFriend,
    blockUser,
    listBlock,
    listFriendOther,
} from '../controllers/friend/index.js';
import { auth } from '../middlewares/index.js';

const router = Router();

router.post('/request/:receiverId', auth, requestFriend);
router.post('/accept/:senderId', auth, acceptFriend);
router.post('/reject/:senderId', auth, denyFriend);
router.delete('/delete-friend/:userId', auth, deleteFriend);
router.get('/list-friends', auth, listFriend);
router.get('/list-requests', auth, listRequest);
router.post('/block/:blockedId', auth, blockUser);
router.get('/list-blocks', auth, listBlock);
router.get('/list-friend-other/:userId', auth, listFriendOther);

export default router;
