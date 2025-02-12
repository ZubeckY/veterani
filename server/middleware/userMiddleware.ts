import {Request, Response, NextFunction} from "express";
import AuthService from "../service/authService";
import config from "../config";

export async function checkValidAuth(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers['authorized'];
    const refreshToken = req.cookies['refreshToken'];

    if (!accessToken && !refreshToken) {
        return res.status(401).send({
            message: 'No token provided'
        });
    }

    try {
        const decoded = new AuthService().validateToken(refreshToken, config.JWT_REFRESH_SECRET);
        return decoded ? next() : res.status(401).send({
            message: 'No token provided'
        })
    } catch (error) {
        if (!refreshToken) {
            return res.status(401).send({
                message: 'No token provided'
            });
        }

        try {
            const newAccessToken = new AuthService().refreshToken(refreshToken);

            if (!newAccessToken) {
                return res.status(401).send({
                    message: 'No token provided'
                });
            }

            res
                .cookie('refreshToken', refreshToken, {httpOnly: true})
                .header('authorized', accessToken)
                .status(200)
        } catch (error) {
            return res.status(400).send({
                message: error
            });
        }
    }
}