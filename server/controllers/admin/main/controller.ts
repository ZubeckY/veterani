import * as uuid from 'uuid'
import * as bcrypt from "bcrypt";
import {Request, Response, Router} from "express";
import {checkRole} from "../../../middleware/auth/checkRole";
import AuthService from "../../../service/authService";
import {Role, roleTypeText} from "../../../types/role";

const mainRouter = Router()
mainRouter.post("/admin/init-user/", checkRole, async (req: Request, res: Response): Promise<any> => {
    try {
        const cookie = req.headers['cookie']
        const currentUser: any = await new AuthService().userRoleIsCorrect(cookie, res)
        if (!currentUser.correct) {
            return currentUser
        }

        const {sessionKey} = req.body
        if (!sessionKey) {
            return res
                .send({
                    email: currentUser.userFromDB.email,
                    needLogin: true,
                })
        }

        const user = currentUser.userFromDB
        const role: Role = user.role
        user.rolePublic = roleTypeText[role]

        delete user.password
        delete user.activated
        delete user.activatedCode
        delete user.created
        delete user.updated

        let menu: any = []
        switch (currentUser.userFromDB.role) {
            case Role.admin:
                menu = [
                    {
                        icon: "mdi-home-outline",
                        text: "Главная",
                        link: '/admin'
                    },
                    {
                        icon: "mdi-account-group-outline",
                        text: "Пользователи",
                        link: '/admin/users'
                    },
                    {
                        icon: "mdi-vote-outline",
                        text: "Голосования",
                        link: '/admin/voting'
                    },
                    {
                        icon: "mdi-file-document-multiple-outline",
                        text: "Документы",
                        link: '/admin/docs'
                    },
                    {
                        icon: "mdi-post-outline",
                        text: "Публикации",
                        link: '/admin/blog'
                    },
                    {
                        icon: "mdi-poll",
                        text: "Журнал событий",
                        link: '/admin/journal'
                    },
                    {
                        icon: "mdi-text-box-outline",
                        text: "Данные организации",
                        link: '/admin/org-data'
                    },
                    {
                        icon: "mdi-card-account-details-outline",
                        text: "Члены организации",
                        link: '/admin/org-team'
                    },
                ]
                break;
            case Role.manager:
                menu = [
                    {
                        icon: "mdi-home-outline",
                        text: "Главная",
                        link: '/admin'
                    },
                    {
                        icon: "mdi-account-group-outline",
                        text: "Пользователи",
                        link: '/admin/users'
                    },
                    {
                        icon: "mdi-post-outline",
                        text: "Публикации",
                        link: '/admin/blog'
                    },
                    {
                        icon: "mdi-file-document-multiple-outline",
                        text: "Документы",
                        link: '/admin/docs'
                    },
                    {
                        icon: "mdi-text-box-outline",
                        text: "Данные организации",
                        link: '/admin/org-data'
                    },
                ]
                break;
            default:
                menu = []
                break;
        }

        res
            .status(200)
            .send({
                menu,
                user
            })
    } catch (error) {
        res
            .status(500)
            .send({
                message: 'Ошибка'
            })
    }
})

mainRouter.post("/admin/login/", checkRole, async (req: Request, res: Response): Promise<any> => {
    try {
        const cookie = req.headers['cookie']
        const currentUser: any = await new AuthService().userRoleIsCorrect(cookie, res)
        if (!currentUser.correct) {
            return currentUser
        }

        const {password} = req.body
        const userPass = currentUser.userFromDB.password

        const isCodeEquals = await bcrypt.compare(password, userPass)
        if (!isCodeEquals) {
            return res
                .status(403)
                .send({
                    message: 'Неверный пароль',
                })
        }

        const sessionKey = uuid.v4()

        res.send({
            sessionKey
        })
    } catch (error) {
        console.log(error)
        res
            .status(500)
            .send({
                message: 'Ошибка'
            })
    }
})

export default mainRouter