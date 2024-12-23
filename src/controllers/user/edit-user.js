import { UserRepo } from '../../models/index.js';
import { validateEditUser } from '../../validators/user.validator.js';
import { uploadMedia, deleteMedia } from '../../services/cloudinary/index.js';

export default async (req, res) => {
    try {
        const { error } = validateEditUser(req.body);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }

        const user = await UserRepo.findOneBy({ id: req.user.id });

        // Update user information
        if (req.body.firstName) user.firstName = req.body.firstName;
        if (req.body.lastName) user.lastName = req.body.lastName;
        if (req.body.birthday) user.birthday = req.body.birthday;
        if (req.body.address) user.address = req.body.address;
        if (req.body.biography) user.biography = req.body.biography;

        if (req.body.username && req.body.username !== user.username) {
            const exist = await UserRepo.exists({ where: { username: req.body.username } });
            if (exist) {
                return res.status(400).json({
                    error: 'There is already a user with this username, please enter another.',
                });
            }
            user.username = req.body.username;
        }

        // Save uploaded image path in user profile if image is provided
        if (req.file) {
            if (user.avatar) {
                await deleteMedia(user.avatar);
            }

            const photoUrl = await uploadMedia(req.file);
            user.avatar = photoUrl;
        }

        await UserRepo.save(user);

        // remove password from user object
        user.password = undefined;

        return res.status(200).json({
            message: 'Your profile information was changed successfully.',
            user,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: 'An internal server error occurred, please try again.' });
    }
};

/**
 * @swagger
 * /user:
 *   put:
 *     summary: Edit the Profile Information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Some of the user profile information to change
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *               address:
 *                 type: string
 *               biography:
 *                 type: string
 *               username:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     tags:
 *       - User
 *     responses:
 *       "200":
 *         description: Your profile information was changed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your profile information was changed successfully.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     birthday:
 *                       type: string
 *                       format: date
 *                     address:
 *                       type: string
 *                     biography:
 *                       type: string
 *                     username:
 *                       type: string
 *                     avatar:
 *                       type: string
 *       "400":
 *         description: Please provide valid values for each key you want to change.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: There is already a user with this username, please enter another.
 *       "401":
 *         description: Invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid token.
 *       "500":
 *         description: An internal server error occurred, please try again.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An internal server error occurred, please try again.
 */
