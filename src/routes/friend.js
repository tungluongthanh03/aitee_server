import { Router } from 'express';

import {
    requestFriend,
    acceptFriend,
    denyFriend,
    listFriend,
    listRequest,
    deleteFriend,
} from '../controllers/friend/index.js';
import { auth, imageUpload, checkAdmin } from '../middlewares/index.js';

const router = Router();

router.post('/request-friend/:id', auth, requestFriend);
router.patch('/accept-friend/:requestID', auth, acceptFriend);
router.get('/list-friend/:id', auth, listFriend);
router.get('/list-request/:id', auth, listRequest);
router.delete('/deny-friend/:requestID', auth, denyFriend);
router.delete('/delete-friend/:requestID', auth, deleteFriend);
export default router;
