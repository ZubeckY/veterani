import AuthDto from "../DTOS/auth.dto";
import config from "../config";
import jwt from 'jsonwebtoken'
import {AppDataSource} from "../connectDb";
import {Token} from "../entity/token";
import {User} from "../entity";


export default class AuthService {
    generateTokens(payload: AuthDto) {
        try {
            const accessToken = jwt.sign(payload, config.JWT_ACCESS_SECRET, { expiresIn: '15m' })
            const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {expiresIn: '24h'})
            return {
                accessToken,
                refreshToken,
            }
        } catch (e) {
            return {
                message: 'Ошибка сервера',
                error: e,
            }
        }
    }

    validateToken(token: any, secret: any) {
        try {
            return jwt.verify(token, secret)
        } catch (e) {
            return null
        }
    }

    async saveToken(model: any) {
        try {
            const { user, value } = model

            const tokenRepository = AppDataSource.getRepository(Token)
            const tokenData = await tokenRepository .findOneBy({
                user: user
            })

            if (tokenData) {
                tokenData.accessToken = value.accessToken
                tokenData.refreshToken = value.refreshToken
                return await tokenRepository.save(tokenData)
            }

            const createToken = new Token()
            createToken.user = user
            createToken.accessToken = value.accessToken
            createToken.refreshToken = value.refreshToken

            return await tokenRepository.save(createToken)
        } catch (e) {
            return {
                message: 'Ошибка сервера',
                error: e,
            }
        }
    }

    async findAccessToken(token: string) {
        try {
            const tokenRepository = AppDataSource.getRepository(Token)
            const tokenFromDB = await tokenRepository.findOneBy({
                accessToken: token,
            })

            if (!tokenFromDB) {
                return null
            }

            return tokenFromDB
        } catch (e) {
            return null
        }
    }

    async findRefreshToken(token: string) {
        try {
            const tokenRepository = AppDataSource.getRepository(Token)
            const tokenFromDB = await tokenRepository.findOneBy({
                refreshToken: token,
            })

            if (!tokenFromDB) {
                return null
            }

            return tokenFromDB
        } catch (e) {
            return null
        }
    }

    async findAndRefreshAccessToken(token: string) {
        try {
            // Проверяем токен
            const tokenFromDB = await this.findRefreshToken(token)
            if (!tokenFromDB) {
                return null
            }

            // проверяем пользователя по привязке
            const userRepository = AppDataSource.getRepository(User)
            const userFromDB = await userRepository.findOneBy({
                id: tokenFromDB.user.id,
            })

            if (!userFromDB) {
                return null
            }

            // берем данные от пользователя с бд
            const DTO = {
                id: userFromDB.id,
                email: userFromDB.email,
            }

            // создаем дто для создания токена
            const userDto = new AuthDto(DTO)
            const tokens = new AuthService().generateTokens({...userDto})

            // проверяем рефреш токен
            const {accessToken} = tokens
            if (!accessToken) {
                return null
            }

            // обновляем в бд
            const tokenRepository = AppDataSource.getRepository(Token)
            tokenFromDB.accessToken = accessToken

            await tokenRepository.save(tokenFromDB)
            return accessToken
        }
        catch (e) {
            return null
        }
    }
}