import {Request, Response, NextFunction} from "express";
import AuthService from "../service/authService";
import {AppDataSource} from "../connectDb";
import config from "../config";
import {User} from "../entity";

export async function checkValidAuth(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        /* Берем данные с запроса */
        const cookie: any = req.headers['cookie']
        if (!cookie) {
            return res
                .status(401)
                .send({
                    message: 'Отсутствуют cookie. Код ошибки - 1010'
                });
        }

        const refreshToken = cookie.split('refreshToken=')[1]
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

        const userFromDB = await AppDataSource
            .getRepository(User)
            .findOneBy({
                id,
                email,
            })

        if (!userFromDB) {
            return res
                .status(401)
                .send({
                    message: 'Пользователь указан неверно. Код ошибки - 1045'
                })
        }

        return next()
    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .send({
                message: 'Ошибка сервера 1050'
            })
    }
}