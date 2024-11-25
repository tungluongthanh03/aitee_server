import { adminId } from '../../config/index.js';

export async function checkAdmin(req, res, next) {
    try {
        // since there is only 1 admin in the system, we just need to check the id with the id we have hardcoded
        if (req.user.id !== adminId)
            return res
                .status(403)
                .json({ error: 'Access denied. You do not have permission to access.' });

        req.user.isAdmin = true;
        next();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
