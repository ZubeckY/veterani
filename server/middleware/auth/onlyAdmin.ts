import {NextFunction, Request, Response} from "express";
import {Role} from "../../types/role";
import AuthService from "../../service/authService";

export async function onlyAdmin(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const requiredRoles = [Role.admin]

        const cookie: any = req.headers['cookie']
        const refreshToken = await new AuthService().getTokenFromCookie(cookie);
        if (!refreshToken) {
            return res
                .status(401)
                .send({
                    message: 'Токен не найден. Код ошибки - 1020',
                })
        }


        const userFromDB: any = await new AuthService().getUserByToken(refreshToken)
        if (!userFromDB) {
            return res
                .status(401)
                .send({
                    message: 'Пользователь указан неверно. Код ошибки - 1045'
                })
        }

        const roleIncludes = requiredRoles.includes(userFromDB.role)
        if (!roleIncludes) {
            return res
                .status(403)
                .send({
                    message: 'Ошибка доступа'
                })
        }

        return next()
    } catch (e) {
        console.log(e)
        return res
            .status(500)
            .send({
                message: 'Ошибка сервера'
            })
    }
}