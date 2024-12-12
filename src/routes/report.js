import { Router } from 'express';

import {
    listReportPost,
    listReportUser,
    ignoreReportPost,
    ignoreReportUser,
    acceptReportPost,
    acceptReportUser,
    reportPost,
    reportUser,
} from '../controllers/report/index.js';
import { auth, checkAdmin } from '../middlewares/index.js';

const router = Router();
// Admin routes

router.get('/report-list-post', auth, checkAdmin, listReportPost);
router.get('/report-list-user', auth, checkAdmin, listReportUser);

router.put('/ignore-report-post/:reportId', auth, checkAdmin, ignoreReportPost);
router.put('/ignore-report-user/:reportId', auth, checkAdmin, ignoreReportUser);

router.delete('/accept-report-post/:reportId', auth, checkAdmin, acceptReportPost);
router.delete('/accept-report-user/:reportId', auth, checkAdmin, acceptReportUser);

router.post('/user/:reportedId', auth, reportUser);
router.post('/post/:postId', auth, reportPost);

export default router;
