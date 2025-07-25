import {Router, Request, Response, NextFunction} from "express";
import {User} from "../../entity";
import * as bcrypt from 'bcrypt'
import {AppDataSource} from "../../connectDb";
import AuthDto from "../../DTOS/auth.dto";
import AuthService from "../../service/authService";
import EmailService from "../../service/emailService";
import {checkValidAuth} from "../../middleware/auth/checkValidAuth";
import {Role, roleTypeText} from "../../types/role";
import * as EmailValidator from 'email-validator';
import MemberUser from "../../DTOS/member.user";
import {OrgRole} from "../../types/orgRole";

const emailService = new EmailService();
const userRouter = Router();

userRouter.post("/auth/login", async (req: Request, res: Response): Promise<any> => {
    try {
        const {model} = req.body;
        const {password} = req.body?.model
        const email = model.email.toLowerCase()

        const userRepository = AppDataSource.getRepository(User)
        const userFromDB: User | null = await userRepository.findOneBy({
            email: email,
        })

        if (!userFromDB) {
            return res.status(400).send({
                message: 'Пользователь с таким email не найден',
            })
        }

        const isCodeEquals = await bcrypt.compare(password, userFromDB.password)
        if (!isCodeEquals) {
            return res.status(400).send({
                message: 'Неверный пароль',
            })
        }

        const DTO = {
            id: userFromDB.id,
            email: userFromDB.email,
        }

        const userDto = new AuthDto(DTO)
        const tokens: any = new AuthService().generateTokens({...userDto})

        const {accessToken} = tokens
        if (!accessToken) {
            return res.status(501).send({
                message: "ошибка создания токена"
            })
        }

        return res.send(tokens)
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: error,
        })
    }
})

userRouter.post("/auth/register", async (req: Request, res: Response): Promise<any> => {
    try {
        const {model} = req.body
        const email = model.email.toLowerCase()
        const {firstName, lastName, middleName, password} = model

        const values = Object.values(model)
        for (let i = 1; i < values.length; i++) {
            if (String(values[i]).length <= 1) {
                return res.status(400).send({
                    message: "Пустое значение"
                })
            }
        }

        const userRepository = AppDataSource.getRepository(User)
        const userFromDB: User | null = await userRepository.findOneBy({
            email: email,
        })

        if (userFromDB) {
            return res.status(400).send({
                message: "Пользователь с такой почтой уже существует"
            })
        }

        const newUser = new User()
        const userPassword: any = await bcrypt.hash(password, 3)

        newUser.firstName = firstName
        newUser.lastName = lastName
        newUser.middleName = middleName
        newUser.email = email
        newUser.password = userPassword
        newUser.activatedCode = emailService.generateOTPCode()

        const userSaved = await userRepository.save(newUser)

        const DTO = {
            id: userSaved.id,
            email: userSaved.email,
        }

        const userDto = new AuthDto(DTO)
        const tokens: any = new AuthService().generateTokens({...userDto})

        const {accessToken} = tokens
        if (!accessToken) {
            console.log("501 у токена")
            return res.status(501).send({
                message: "ошибка создания токена"
            })
        }

        await emailService.sendActivationCode(userSaved.email, userSaved.activatedCode)

        return res.send(tokens)
    } catch (error) {
        console.log(error)
        return res.status(501).send({
            message: error,
        })
    }
})

userRouter.post("/auth/refresh/", checkValidAuth, async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        res.send({
            message: 'ping - pong'
        })
    } catch (error) {
        return res.status(501).send({
            message: error,
        })
    }
});

userRouter.get('/auth/lk', async (req: Request, res: Response): Promise<any> => {
    try {
        const cookies = req.headers['cookie']
        const userFromDB: any = await new AuthService().getUserFromCookies(cookies)
        if (userFromDB.error) {
            return res
                .status(401)
                .send({
                    message: userFromDB.message
                })
        }

        delete userFromDB.activatedCode
        delete userFromDB.password
        delete userFromDB.updated

        const role: Role = userFromDB.role
        userFromDB.rolePublic = roleTypeText[role]

        return res
            .status(200)
            .send({
                user: userFromDB
            })

    } catch (error) {
        res
            .status(501)
            .send({
                message: 'Ошибка'
            })
    }
})

userRouter.get("/auth/user/:id/", async (req: Request, res: Response): Promise<any> => {
    try {
        const {id} = req.params
        if (!(Number.isInteger(+id))) {
            return res
                .status(400)
                .send({
                    message: 'Не указан пользователь'
                })
        }

        const userRepository = AppDataSource.getRepository(User)
        const userFromDB: any = await userRepository.findOneBy({id: +id})
        if (!userFromDB) {
            return res
                .status(404)
                .send({
                    message: 'Пользователь не найден'
                })
        }

        delete userFromDB.password
        delete userFromDB.activated
        delete userFromDB.activatedCode
        delete userFromDB.created
        delete userFromDB.updated

        const role: Role = userFromDB.role
        userFromDB.rolePublic = roleTypeText[role]

        return res
            .status(200)
            .send({
                user: userFromDB
            })
    } catch (error) {
        res
            .status(501)
            .send({
                message: 'Ошибка'
            })
    }
})

userRouter.patch("/auth/user/activate-account", checkValidAuth, async (req: Request, res: Response): Promise<any> => {
    try {
        const cookies = req.headers['cookie']
        const userFromDB: any = await new AuthService().getUserFromCookies(cookies)
        if (userFromDB.error) {
            return res
                .status(401)
                .send({
                    message: userFromDB.message
                })
        }

        const {model} = req.body

        if (model != userFromDB.activatedCode) {
            return res.status(400).send({
                message: "Неверный код"
            })
        }

        userFromDB.activatedCode = ""
        userFromDB.activated = true
        userFromDB.role = Role.user

        const userRepository = AppDataSource.getRepository(User)

        await userRepository.save(userFromDB)
        await emailService.sendMessageYouActivated(userFromDB.email)

        res.send({
            message: "Ok"
        })
    } catch (error) {
        return res.status(500).send({
            message: "Error activated"
        })
    }
})

userRouter.patch("/auth/user/refresh-code", checkValidAuth, async (req: Request, res: Response): Promise<any> => {
    try {
        const cookies = req.headers['cookie']
        const userFromDB: any = await new AuthService().getUserFromCookies(cookies)
        if (userFromDB.error) {
            return res
                .status(401)
                .send({
                    message: userFromDB.message
                })
        }

        userFromDB.activatedCode = emailService.generateOTPCode()

        const userRepository = AppDataSource.getRepository(User)
        await userRepository.save(userFromDB)

        await emailService.sendActivationCode(userFromDB.email, userFromDB.activatedCode)

        res.send({
            message: "Ок",
        })
    } catch (error) {
        return res.status(500).send({
            message: "Ошибка изменения кода"
        })
    }
})

userRouter.delete("/user/delete", checkValidAuth, async (req: Request, res: Response): Promise<any> => {
    try {
        const cookies = req.headers['cookie']
        const userFromDB: any = await new AuthService().getUserFromCookies(cookies)
        if (userFromDB.error) {
            return res
                .status(401)
                .send({
                    message: userFromDB.message
                })
        }

        const userRepository = AppDataSource.getRepository(User)
        await userRepository.delete(userFromDB)

        await emailService.sendEmailNotificationDelete(userFromDB.email)

        res.status(200).send({
            message: "Пользователь удалён"
        })

    } catch (error) {
        return res.status(500).send({
            message: "Ошибка изменения кода"
        })
    }
})

userRouter.post("/user/email/change", checkValidAuth, async (req: Request, res: Response): Promise<any> => {
    try {
        const cookies = req.headers['cookie']
        const userFromDB: any = await new AuthService().getUserFromCookies(cookies)
        if (userFromDB.error) {
            return res
                .status(401)
                .send({
                    message: userFromDB.message
                })
        }

        const body: any = req.body

        if (body.currentEmail != userFromDB.email) {
            return res.status(400).send({
                message: "Неправильная подключенная почта"
            })
        }

        if (!EmailValidator.validate(body.newEmail)) {
            return res.status(400).send({
                message: "Неправильный формат почты"
            })
        }

        userFromDB.activatedCode = emailService.generateOTPCode()

        const userRepository = AppDataSource.getRepository(User)
        await userRepository.save(userFromDB)

        await emailService.sendAcceptCode(userFromDB.email, userFromDB.activatedCode)

        res.status(200).send({
            email: body.email,
            message: "Письмо отправлено"
        })
    } catch (error) {
        return res.status(500).send({
            message: "ошибка"
        })
    }
})

userRouter.patch("/user/email/accept", checkValidAuth, async (req: Request, res: Response): Promise<any> => {
    try {
        const cookies = req.headers['cookie']
        const userFromDB: any = await new AuthService().getUserFromCookies(cookies)
        if (userFromDB.error) {
            return res
                .status(401)
                .send({
                    message: userFromDB.message
                })
        }

        const body: any = req.body

        if (userFromDB.activatedCode != body.code) {
            return res.status(400).send({
                message: "Неверный код"
            })
        }

        userFromDB.email = body.newEmail
        userFromDB.activatedCode = ""
        userFromDB.activated = false

        const userRepository = AppDataSource.getRepository(User)
        await userRepository.save(userFromDB)

        res.status(200).send({
            message: "Почта обновлена"
        })
    } catch (error) {
        return res.status(500).send({
            message: "ошибка"
        })
    }
})

userRouter.get("/user/our-team/", async (req: Request, res: Response): Promise<any> => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const membersListFromDB = await userRepository.find({
            where: {
                memberRole: OrgRole.member
            }
        })

        const users = membersListFromDB.map(user => new MemberUser({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            memberRole: user.memberRole,
            memberRoleTitle: user.memberRoleTitle,
        }));

        return res
            .status(200)
            .send(users);
    } catch (error) {
        res
            .status(500)
            .send({
                message: 'Ошибка'
            })
    }
})

export default userRouter;