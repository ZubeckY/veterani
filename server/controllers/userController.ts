import {Router, Request, Response, NextFunction} from "express";
import {User} from "../entity";
import * as bcrypt from 'bcrypt'
import {AppDataSource} from "../connectDb";
import AuthDto from "../DTOS/auth.dto";
import AuthService from "../service/authService";
import EmailService from "../service/emailService";
import {checkValidAuth} from "../middleware/auth/checkValidAuth";
import {Role, roleTypeText} from "../types/role";

const emailService = new EmailService();
const userRouter = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Авторизация пользователя
 *     description: Вход в систему по email и паролю. Возвращает accessToken и refreshToken.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "user@example.com"
 *                   password:
 *                     type: string
 *                     format: password
 *                     example: "P@ssw0rd!"
 *     responses:
 *       200:
 *         description: Успешный вход в систему
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsIn..."
 *       400:
 *         description: Неверный email или пароль
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Неверный пароль"
 *       501:
 *         description: Ошибка создания токена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ошибка создания токена"
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */

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

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Регистрация пользователя
 *     description: Создание нового аккаунта, отправка кода активации на email.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     example: "Иван"
 *                   lastName:
 *                     type: string
 *                     example: "Иванов"
 *                   middleName:
 *                     type: string
 *                     example: "Иванович"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "user@example.com"
 *                   password:
 *                     type: string
 *                     format: password
 *                     example: "P@ssw0rd!"
 *     responses:
 *       200:
 *         description: Успешная регистрация, возвращает accessToken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsIn..."
 *       400:
 *         description: Ошибка ввода (пустые поля, email уже существует)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Пользователь с такой почтой уже существует"
 *       501:
 *         description: Ошибка сервера или создания токена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ошибка создания токена"
 */

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

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Обновление токена
 *     description: Пока ничего.
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Успешное обновление токена.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ping - pong"
 *       501:
 *         description: Внутренняя ошибка сервера.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ошибка"
 */

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

/**
 * @swagger
 * /auth/lk:
 *   get:
 *     summary: Получить данные текущего пользователя
 *     description: Проверяет токен из cookie и возвращает данные пользователя без конфиденциальной информации.
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Данные текущего пользователя.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     firstName:
 *                       type: string
 *                       example: "Иван"
 *                     lastName:
 *                       type: string
 *                       example: "Иванов"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     rolePublic:
 *                       type: string
 *                       example: "Администратор"
 *       401:
 *         description: Токен не найден или пользователь не найден.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Токен не найден. Код ошибки - 1020"
 *       501:
 *         description: Внутренняя ошибка сервера.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ошибка"
 */

userRouter.get('/auth/lk', async (req: Request, res: Response): Promise<any> => {
    try {
        const userFromDB: any = await new AuthService().getUserFromCookies(req.headers['cookie'], res)
        if (!userFromDB.id) {
            return userFromDB
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

    } catch (e) {
        res
            .status(501)
            .send({
                message: 'Ошибка'
            })
    }
})

/**
 * @swagger
 * /auth/user/:id:
 *   get:
 *     summary: Получить данные другого пользователя
 *     description: Получение информации о пользователе по ID. Конфиденциальные данные удаляются перед отправкой.
 *     tags: [Auth]
 *     parameters:
 *       - name: id
 *         in: params
 *         description: Идентификатор пользователя.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Данные пользователя.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     firstName:
 *                       type: string
 *                       example: "Иван"
 *                     lastName:
 *                       type: string
 *                       example: "Иванов"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     rolePublic:
 *                       type: string
 *                       example: "Пользователь"
 *       400:
 *         description: Неверно указан ID пользователя.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Не указан пользователь"
 *       404:
 *         description: Пользователь не найден.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Пользователь не найден"
 *       501:
 *         description: Внутренняя ошибка сервера.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ошибка"
 */

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
    } catch (e) {
        res
            .status(501)
            .send({
                message: 'Ошибка'
            })
    }
})

userRouter.patch("/auth/user/activate-account", checkValidAuth, async (req: Request, res: Response): Promise<any> => {
    try {
        const userFromDB: any = await new AuthService().getUserFromCookies(req.headers['cookie'], res)
        if (!userFromDB.id) {
            return userFromDB
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
    } catch (e) {
        return res.status(500).send({
            message: "Error activated"
        })
    }
})

userRouter.patch("/auth/user/refresh-code", checkValidAuth, async (req: Request, res: Response): Promise<any> => {
    try {
        const userFromDB: any = await new AuthService().getUserFromCookies(req.headers['cookie'], res)
        if (!userFromDB.id) {
            return userFromDB
        }

        userFromDB.activatedCode = emailService.generateOTPCode()

        const userRepository = AppDataSource.getRepository(User)
        await userRepository.save(userFromDB)

        await emailService.sendActivationCode(userFromDB.email, userFromDB.activatedCode)

        res.send({
            message: "Ок",
        })
    } catch (e) {
        return res.status(500).send({
            message: "Ошибка изменения кода"
        })
    }
})

export default userRouter;