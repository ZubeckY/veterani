import {Request, Response, NextFunction} from "express";
import AuthService from "../service/authService";
import config from "../config";

export async function checkValidAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const accessTokenFromHeaders: any = req.headers['authorized'];
        const accessToken = accessTokenFromHeaders.split('authorized=')[1]

        const refreshTokenFromCookies: any = req.headers?.cookies;
        const refreshToken = refreshTokenFromCookies.split('refreshToken=')[1]

        if (!accessToken && !refreshToken) {
            return res.status(401).send({
                message: 'No token provided'
            });
        }

        const decoded = new AuthService().validateToken(refreshToken, config.JWT_REFRESH_SECRET);

        return decoded ? next() : res.status(401).send({
            message: 'No token provided'
        })

    } catch (error) {
        try {
            console.log('start catch')

            const refreshTokenFromCookies: any = req.headers?.cookies;
            const refreshToken = refreshTokenFromCookies.split('refreshToken=')[1]

            console.log('refreshToken catch: ', refreshToken)

            if (!refreshToken) {
                return res.status(401).send({
                    message: 'No token provided'
                });
            }

            const newAccessToken: any = new AuthService().refreshToken(refreshToken);

            if (!newAccessToken) {
                return res.status(401).send({
                    message: 'No token provided'
                });
            }

            res
                .cookie('refreshToken', refreshToken, {httpOnly: true})
                .header('authorized', newAccessToken)
                .status(200)
        } catch (error) {
            return res.status(400).send({
                message: error
            });
        }
    }
}