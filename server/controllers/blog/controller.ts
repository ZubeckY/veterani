//@ts-ignore
import translitRusEng from 'translit-rus-eng'
import {Router, Request, Response} from "express";
import {Post, User, File} from "../../entity";
import {AppDataSource} from "../../connectDb";
import {checkValidAuth} from "../../middleware/auth/checkValidAuth";
import AuthService from "../../service/authService";
import {Role} from "../../types/role";
import {In} from "typeorm";

const blogRouter = Router();

blogRouter.get('/post/list', async (req: Request, res: Response): Promise<any> => {
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

        const skip = (+(req.query?.page ?? 1) - 1) * +(req.query?.size ?? 10)
        const takePage = +(req.query?.page ?? 1) * +(req.query?.size ?? 10)
        const give = +(req.query?.give ?? 10)
        const take = takePage ?? give

        const author = (req.query.author ?? 'all')

        const postRepository = AppDataSource.getRepository(Post)
        const qb = postRepository.createQueryBuilder('post')

        qb.where("published = :published", {published: true})
            .leftJoinAndSelect('post.user', 'user')


        if (author == 'author') {
            qb.andWhere("post.user.id = :user_id", {
                user_id: userFromDB.id
            });
        }

        if (author == 'community') {
            qb.andWhere("post.user.id NOT IN (" + userFromDB.id + ")")
        }

        const post = await qb
            .skip(skip)
            .take(take)
            .getMany()

        return res.send(post)
    } catch (error) {
        console.log(error)
        res.status(503).send({
            message: "Ошибка"
        })
    }
})

blogRouter.get('/post/slider-only/', async (req: Request, res: Response): Promise<any> => {
    try {
        const postRepository = AppDataSource.getRepository(Post)
        const post = await postRepository.find({
            where: {
                published: true,
                includesSlider: true,
            },
            order: {
                created: 'DESC'
            },
            take: 6
        })

        return res.send(post)
    } catch (error) {
        console.log(error)
        res.status(503).send({
            message: "Ошибка"
        })
    }
})

blogRouter.get('/post/:link', async (req: Request, res: Response): Promise<any> => {
    try {
        const link = req.params.link;

        const postRepository = AppDataSource.getRepository(Post)
        const post: any = await postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .leftJoinAndSelect('post.files', 'files')
            .where("link = :link", {link: link})
            .getOne()

        if (!post) {
            return res.status(404).send({
                message: "Пост не найден"
            })
        }

        delete post.includesSlider
        delete post.suggested

        delete post.user.middleName
        delete post.user.email
        delete post.user.password
        delete post.user.created
        delete post.user.activated
        delete post.user.activatedCode
        delete post.user.updated
        delete post.user.block

        return res.send(post)
    } catch (error) {
        res.status(503).send({
            message: "Ошибка"
        })
    }
})

blogRouter.post('/post/create', checkValidAuth, async (req: Request, res: Response): Promise<any> => {
    try {
        const {model} = req.body
        console.log('model', model)

        const {headLine, text, includesSlider} = model
        const values = Object.values(model)

        for (let i = 1; i < values.length; i++) {
            if (String(values[i]).length <= 1) {
                return res.status(400).send({
                    message: "Пустое значение"
                })
            }
        }

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
            res.status(401).send({
                message: "user undefind"
            })
        }

        const requiredRoles = [
            Role.admin,
            Role.manager,
        ]

        const roleIncludes = requiredRoles.includes(userFromDB.role)
        const link = translitRusEng(headLine, {loverCase: true, slug: true}).replaceAll('_', '-')

        const {files} = model
        const filesId = []

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            filesId.push(file.id)
        }

        const fileRepository = AppDataSource.getRepository(File)
        const filesFromDB: any = await fileRepository.find({
            where: {
                id: In(filesId)
            }
        })

        // if (!filesFromDB.length) {
        //     return res
        //         .status(404)
        //         .send({
        //             message: 'Файлы не найдены!'
        //         })
        // }

        filesFromDB.forEach((file: any) => {
            file.used = true
        })

        await fileRepository.save(filesFromDB)

        const post = new Post()
        post.user = userFromDB
        post.text = text
        post.headLine = headLine
        post.includesSlider = includesSlider
        post.link = link.toLowerCase()
        post.suggested = !roleIncludes
        post.published = roleIncludes
        post.files = filesFromDB

        const postRepository = AppDataSource.getRepository(Post)
        const saved = await postRepository.save(post)

        return res.status(201).send(saved)
    } catch (error) {
        res.status(503).send({
            message: "Ошибка"
        })
    }
})

blogRouter.patch('/post/update/:link', checkValidAuth, async (req: Request, res: Response): Promise<any> => {
    try {
        const link = req.params.link
        const {model} = req.body

        const postRepository = AppDataSource.getRepository(Post)
        const post: any = await postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .where("link = :link", {link: link})
            .getOne()

        if (!post) {
            res.status(403).send({
                message: "Нет такого поста"
            })
        }

        const cookies = req.headers['cookie']
        const specifiedId = post.user.id

        const correctId = await new AuthService().userRoleIsCorrect(cookies, res)
        if (!correctId.correct) {
            return correctId
        }

        const userId = correctId.userFromDB.id
        if (userId !== specifiedId) {
            if (!correctId.roleIncludes) {
                return res
                    .status(403)
                    .send({
                        message: "роль не совпадает"
                    })
            }
        }

        const linkTitle = translitRusEng(model.headLine, {loverCase: true, slug: true}).replaceAll('_', '-')

        const {files} = model
        const filesId = []

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            filesId.push(file.id)
        }

        const fileRepository = AppDataSource.getRepository(File)
        const filesFromDB: any = await fileRepository.find({
            where: {
                id: In(filesId)
            }
        })

        // if (!filesFromDB.length) {
        //     return res
        //         .status(404)
        //         .send({
        //             message: 'Файлы не найдены!'
        //         })
        // }

        filesFromDB.forEach((file: any) => {
            file.used = true
        })

        await fileRepository.save(filesFromDB)

        post.text = model.text
        post.headLine = model.headLine
        post.includesSlider = model.includesSlider
        post.link = linkTitle.toLowerCase()
        post.files = filesFromDB

        const saved = await postRepository.save(post)

        res.status(200).send(saved)
    } catch (error) {
        console.log(error)
        res.status(503).send({
            message: "Ошибка"
        })
    }
})

blogRouter.delete('/post/delete/:link', checkValidAuth, async (req: Request, res: Response): Promise<any> => {
    try {
        const {link} = req.params

        const postRepository = AppDataSource.getRepository(Post)
        const post = await postRepository.findOneOrFail({
            where: {link}
        })

        if (!post) {
            res.status(503).send({
                message: "Поста не существует"
            })
        }

        const cookies = req.headers['cookie']

        const correctId = await new AuthService().userRoleIsCorrect(cookies, res)
        if (!correctId.correct) {
            return correctId
        }

        await postRepository.remove(post)

        return res
            .status(200)
            .send({
                message: "Ok"
            })
    } catch (error) {
        console.log(error)
        res.status(503).send({
            message: "Ошибка"
        })
    }
})

export default blogRouter;

