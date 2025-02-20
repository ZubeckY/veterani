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

/* получение данных о текущем пользователе */
userRouter.get('/auth/lk', async (req: Request, res: Response): Promise<any> => {
    try {
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

/* получение данных о другом пользователе */
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


export default userRouter;