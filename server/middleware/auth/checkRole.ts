import {NextFunction, Request, Response} from "express";
import AuthService from "../../service/authService";
import {Role} from "../../types/role";

export async function checkRole(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const requiredRoles = [
            Role.admin,
            Role.manager,
        ]

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
                    message: 'Ошибка роли'
                })
        }

        return next()
    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .send({
                message: 'Ошибка сервера'
            })
    }
}