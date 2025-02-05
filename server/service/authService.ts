import AuthDto from "../DTOS/auth.dto";
import config from "../config";
import jwt from 'jsonwebtoken'
import {AppDataSource} from "../connectDb";
import {Token} from "../entity/token";


export default class AuthService {
    generateTokens(payload: AuthDto) {
        try {
            const accessToken = jwt.sign(payload, config.JWT_ACCESS_SECRET, { expiresIn: '15m' })
            const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
                expiresIn: '24h',
                httpOnly: true
            })
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
                tokenData.value = value
                return await tokenRepository.save(tokenData)
            }

            const createToken = new Token()
            createToken.user = user
            createToken.value = value

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

            if (!tokenFromDB) {
                return null
            }

            return tokenFromDB
        } catch (e) {
            return null
        }
    }
}