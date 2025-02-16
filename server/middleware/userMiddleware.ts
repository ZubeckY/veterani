import {Request, Response, NextFunction} from "express";
import AuthService from "../service/authService";
import config from "../config";

export async function checkValidAuth(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const cookie: any = req.headers['cookie']
        const authorization: any = req.headers['authorized']

        const accessToken = authorization.split('authorized=')[1]
        const refreshToken = cookie.split('refreshToken=')[1]

        if (!refreshToken) {
            return res.status(401).send({
                message: `token not found`,
            })
        }

        // декодим refreshToken
        const decodeRefreshToken: any = new AuthService().validateToken(refreshToken, config.JWT_REFRESH_SECRET);

        // при наличии accessToken
        if (decodeRefreshToken && accessToken) {
            const decodeAccessToken: any = new AuthService().validateToken(accessToken, config.JWT_ACCESS_SECRET);
            if (!decodeAccessToken) {
                return {
                    status: 401,
                    message: 'No token provided'
                };
            }

            if (decodeRefreshToken.id != decodeAccessToken.id) {
                return {
                    status: 401,
                    message: 'No token provided'
                };
            }

            if (decodeRefreshToken.email != decodeAccessToken.email) {
                return {
                    status: 401,
                    message: 'No token provided'
                };
            }
        }

        if (decodeRefreshToken && !accessToken) {
            const newAccessToken: any = await new AuthService().refreshToken(refreshToken);

            if (!newAccessToken) {
                return res.status(401).send({
                    message: 'No token provided'
                });
            }

            return res
                .cookie('refreshToken', refreshToken, {httpOnly: true})
                .header('authorized', newAccessToken)
                .status(200)
                .send({
                    message: 'ok'
                })
        }


        return res
            .cookie('refreshToken', refreshToken, {httpOnly: true})
            .header('authorized', accessToken)
            .send({
                message: 'ok'
            })

    } catch (error) {
        try {
            const cookie: any = req.headers['cookie']

            const refreshToken = cookie.split('refreshToken=')[1]

            if (!refreshToken) {
                return {
                    status: 401,
                    message: 'No token provided'
                };
            }

            const newAccessToken: any = await new AuthService().refreshToken(refreshToken);
            console.log('newAccessToken catch', newAccessToken)

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
            console.log(error);

            return res.status(400).send({
                message: error
            });
        }
    }
}