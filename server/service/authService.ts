import AuthDto from "../DTOS/auth.dto"
import config from "../config"
import jwt from 'jsonwebtoken'
import {Response} from "express"
import {AppDataSource} from "../connectDb"
import {User} from "../entity"
import {Role} from "../types/role";

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
        } catch (error) {
            return {
                message: 'Ошибка сервера',
                error,
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
        } catch (error) {
            return {
                message: 'Ошибка сервера',
                error,
            }
        }
    }

    generateRefreshToken(payload: AuthDto) {
        if (!payload) {
            return null
        }
        try {
            const dto = {
                id: payload.id,
                email: payload.email,
            }

            return jwt.sign(dto, config.JWT_REFRESH_SECRET, {expiresIn: config.JWT_EXPIRES_IN.REFRESH})
        } catch (error) {
            return {
                message: 'Ошибка сервера',
                error,
            }
        }
    }

    validateToken(token: any, secret: any) {
        try {
            return jwt.verify(token, secret)
        } catch (error) {
            return null
        }
    }

    // async saveToken(model: any) {
    //     try {
    //         const {user, value} = model
    //
    //         const tokenRepository = AppDataSource.getRepository(Token)
    //         const tokenData = await tokenRepository.findOneBy({
    //             user: user
    //         })
    //
    //         if (tokenData) {
    //             tokenData.value = value.refreshToken
    //             return await tokenRepository.save(tokenData)
    //         }
    //
    //         const createToken = new Token()
    //         createToken.user = user
    //         createToken.value = value.refreshToken
    //
    //         return await tokenRepository.save(createToken)
    //     } catch (error) {
    //         return {
    //             message: 'Ошибка сервера',
    //             error,
    //         }
    //     }
    // }

    // async findToken(token: string) {
    //     try {
    //         const tokenRepository = AppDataSource.getRepository(Token)
    //         const tokenFromDB = await tokenRepository.findOneBy({
    //             value: token,
    //         })
    //
    //         return tokenFromDB ?? null
    //     } catch (error) {
    //         return null
    //     }
    // }

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
        } catch (error) {
            return {
                message: error
            }
        }
    }

    async getTokenFromCookie(cookie: any) {
        try {
            return cookie.split('refreshToken=')[1] ?? null
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async getUserByToken(token: string) {
        try {
            if (!token) {
                return null
            }

            const decoded: any = this.validateToken(token, config.JWT_REFRESH_SECRET)
            if (!decoded) {
                return null
            }

            const userRepository = AppDataSource.getRepository(User)
            const userFromDB: User | null = await userRepository.findOneOrFail({
                where: {
                    id: decoded.id,
                    email: decoded?.email,
                },
                relations: ['file'],
            })

            return userFromDB ?? null
        } catch (error) {
            return {
                message: error
            }
        }
    }

    async getUserFromCookies(cookie: any) {
        try {
            if (!cookie) {
                return {
                    message: 'Нет авторизации. Код ошибки - 1020',
                    error: true,
                }
            }

            const refreshToken = await new AuthService().getTokenFromCookie(cookie);
            if (!refreshToken) {
                return {
                    message: 'Токен не найден. Код ошибки - 1021',
                    error: true,
                }
            }

            const userFromDB: any = await new AuthService().getUserByToken(refreshToken)
            if (!userFromDB) {
                return {
                    message: 'Пользователь указан неверно. Код ошибки - 1045',
                    error: true,
                }
            }

            return userFromDB

        } catch (error) {
            return {
                message: 'Ошибка сервера',
                error: true
            }
        }
    }

    async userRoleIsCorrect(cookie: any, res: Response) {
        try {
            const userFromDB: any = await this.getUserFromCookies(cookie)
            if (!userFromDB.id) {
                return userFromDB
            }

            const requiredRoles = [
                Role.admin,
                Role.manager,
            ]

            const roleIncludes = requiredRoles.includes(userFromDB.role)
            if (!roleIncludes) {
                return res
                    .status(403)
                    .send({
                        message: 'Роль не соответствует запрашиваемой'
                    })
            }

            return {
                userFromDB,
                roleIncludes,
                correct: true
            }
        } catch (error) {
            return res
                .status(500)
                .send({
                    message: 'Ошибка сервера'
                })
        }
    }
}