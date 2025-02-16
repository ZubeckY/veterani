import AuthDto from "../DTOS/auth.dto"
import config from "../config"
import jwt from 'jsonwebtoken'
import {AppDataSource} from "../connectDb"
import {User, Token} from "../entity"

export default class AuthService {
    generateTokens(payload: AuthDto) {
        if (!payload) {
            return null
        }
        try {
            const dto = {
                id: payload.id,
                email: payload.email,
            }

            const accessToken = jwt.sign(dto, config.JWT_ACCESS_SECRET, {expiresIn: config.JWT_EXPIRES_IN.ACCESS})
            const refreshToken = jwt.sign(dto, config.JWT_REFRESH_SECRET, {expiresIn: config.JWT_EXPIRES_IN.REFRESH})
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

    generateAccessToken(payload: AuthDto) {
        if (!payload) {
            return null
        }

        try {
            const dto = {
                id: payload.id,
                email: payload.email,
            }

            return jwt.sign(dto, config.JWT_ACCESS_SECRET, {expiresIn: config.JWT_EXPIRES_IN.ACCESS})
        } catch (e) {
            return {
                message: 'Ошибка сервера',
                error: e,
            }
        }
    }

    generateRefreshToken(payload: AuthDto) {
        if (!payload) {
            return null
        }
        try {
            return jwt.sign(payload, config.JWT_REFRESH_SECRET, {expiresIn: config.JWT_EXPIRES_IN.REFRESH})
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
            const {user, value} = model

            const tokenRepository = AppDataSource.getRepository(Token)
            const tokenData = await tokenRepository.findOneBy({
                user: user
            })

            if (tokenData) {
                tokenData.value = value.refreshToken
                return await tokenRepository.save(tokenData)
            }

            const createToken = new Token()
            createToken.user = user
            createToken.value = value.refreshToken

            return await tokenRepository.save(createToken)
        } catch (e) {
            return {
                message: 'Ошибка сервера',
                error: e,
            }
        }
    }

    async findToken(token: string) {
        try {
            const tokenRepository = AppDataSource.getRepository(Token)
            const tokenFromDB = await tokenRepository.findOneBy({
                value: token,
            })

            return tokenFromDB ?? null
        } catch (e) {
            return null
        }
    }

    async refreshToken(token: string) {
        if (!token) {
            return null
        }

        try {
            const userFromDB: any = await this.getUserByToken(token)
            if (!userFromDB) {
                return null
            }

            const DTO: AuthDto = new AuthDto({
                id: userFromDB.id,
                email: userFromDB.email,
            })

            return this.generateAccessToken(DTO) ?? null
        } catch (e) {
            return {
                message: e
            }
        }
    }

    async getUserByToken(token: string) {
        if (!token) {
            return null
        }

        try {
            const decoded: any = this.validateToken(token, config.JWT_REFRESH_SECRET)
            if (!decoded) {
                return null
            }

            const userRepository = AppDataSource.getRepository(User)
            const userFromDB: User | null = await userRepository.findOneBy({
                email: decoded?.email,
            })

            return userFromDB ?? null
        } catch (e) {
            return {
                message: e
            }
        }
    }
}