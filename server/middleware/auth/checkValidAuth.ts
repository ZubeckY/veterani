import {Request, Response, NextFunction} from "express";
import AuthService from "../../service/authService";
import config from "../../config";

export async function checkValidAuth(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const cookie: any = req.headers['cookie']
        if (!cookie) {
            return res
                .status(401)
                .send({
                    message: 'Отсутствуют cookie. Код ошибки - 1010'
                });
        }

        const refreshToken = await new AuthService().getTokenFromCookie(cookie);
        if (!refreshToken) {
            return res
                .status(401)
                .send({
                    message: 'Токен не найден. Код ошибки - 1020',
                })
        }

        /* разбираем refreshToken */
        const decodeRefreshToken: any = new AuthService().validateToken(refreshToken, config.JWT_REFRESH_SECRET);
        if (!decodeRefreshToken) {
            return res
                .status(401)
                .send({
                    message: 'Не валидный токен. Код ошибки - 1030',
                })
        }

        const {id, email} = decodeRefreshToken;
        if (!id && !email) {
            return res
                .status(401)
                .send({
                    message: 'Пользователь не указан. Код ошибки - 1040',
                })
        }

        const userFromDB:any = await new AuthService().getUserByToken(refreshToken)
        if (!userFromDB) {
            return res
                .status(401)
                .send({
                    message: 'Пользователь указан неверно. Код ошибки - 1045'
                })
        }

        if(userFromDB.block){
            return res
                .status(403)
                .send({
                    message: "Пользователь заблокирован. Код ошибки - 1090"
                })
        }

        return next()
    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .send({
                message: 'Ошибка сервера. Код ошибки - 1050'
            })
    }
}