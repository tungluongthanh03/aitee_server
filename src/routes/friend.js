import { Router } from 'express';

import {
    requestFriend,
    acceptFriend,
    denyFriend,
    listFriend,
    listRequest,
    deleteFriend,
} from '../controllers/friend/index.js';
import { auth } from '../middlewares/index.js';

const router = Router();

router.post('/request/:receiverId', auth, requestFriend);
router.post('/accept/:senderId', auth, acceptFriend);
router.post('/reject/:senderId', auth, denyFriend);
router.delete('/delete-friend/:userId', auth, deleteFriend);
router.get('/list-friends', auth, listFriend);
router.get('/list-requests', auth, listRequest);

export default router;
