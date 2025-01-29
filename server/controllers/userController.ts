import express from "express";
import {User} from "../entity";
import * as bcrypt from 'bcrypt'
import {AppDataSource} from "../connectDb";
import AuthDto from "../DTOS/auth.dto";
import AuthService from "../service/authService";

const userRouter = express.Router();

userRouter.post("/auth/login", async (req, res): Promise<any> => {
    try {
        const { email, password } = req.body?.model
        const userRepository = AppDataSource.getRepository(User)
        const userFromDB: User | null = await userRepository.findOneBy({
            email: email,
        })

        if (!userFromDB) {
            return {
                message: 'Пользователь с таким email не найден',
            }
        }

        const isCodeEquals = await bcrypt.compare(password, userFromDB.password)
        if (!isCodeEquals) {
            return {
                message: 'Неверный пароль',
            }
        }

        const DTO = {
            id: userFromDB.id,
            email: userFromDB.email,
        }

        const userDto = new AuthDto(DTO)
        const tokens = new AuthService().generateTokens({ ...userDto })

        const { accessToken } = tokens

        if (!accessToken) {
            return {
                message: 'Ошибка создания токена',
            }
        }

        return tokens
    }
    catch (error) {

    }
})

export default userRouter;