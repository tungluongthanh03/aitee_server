import pkg from 'jsonwebtoken';

import { signAccessToken, signRefreshToken } from '../../services/auth/index.js';
import { validateRefreshToken } from '../../validators/user.validator.js';
import { refreshTokenSecretKey } from '../../config/index.js';

const { verify } = pkg;

export default async (req, res) => {
    try {
        const { error } = validateRefreshToken(req.body);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }

        try {
            req.user = verify(req.body.refreshToken, refreshTokenSecretKey);
        } catch (err) {
            return res.status(400).json({ error: "The token couldn't be verified, please login." });
        }

        const accessToken = signAccessToken(req.user.id);
        const refreshToken = signRefreshToken(req.user.id);

        return res.status(200).json({
            message: 'The token is refreshed successfully.',
            accessToken,
            refreshToken,
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
 * /user/refresh-token:
 *    post:
 *      summary: Refreshes the Access Token
 *      requestBody:
 *        description: Valid Refresh Token
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                refreshToken:
 *                  type: string
 *      tags:
 *        - User
 *      responses:
 *        "200":
 *          description: The token is refreshed successfully.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          resultMessage:
 *                              $ref: '#/components/schemas/ResultMessage'
 *                          resultCode:
 *                              $ref: '#/components/schemas/ResultCode'
 *                          accessToken:
 *                              type: string
 *                          refreshToken:
 *                              type: string
 *        "400":
 *          description: Please provide refresh token.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 *        "500":
 *          description: An internal server error occurred, please try again.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 */
