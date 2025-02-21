import {Router, Request, Response} from "express";
import {Post} from "../entity";
import {AppDataSource} from "../connectDb";
import {checkValidAuth} from "../middleware/auth/checkValidAuth";
import AuthService from "../service/authService";
//@ts-ignore
import translitRusEng from 'translit-rus-eng'
import {Role} from "../types/role";

const blogRouter = Router();

blogRouter.get('/post/getMany', async (req: Request, res: Response): Promise<any> => {
    try {
        const skip = (+(req.query?.page ?? 1) - 1) * +(req.query?.size ?? 10)
        const take = +(req.query?.page ?? 1) * +(req.query?.size ?? 10)
        const postRepository = AppDataSource.getRepository(Post)
        const post = await postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .skip(skip)
            .take(take)
            .where("published = :published", {published: true})
            .getMany()
        return res.send(post)
    } catch (e) {
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
            .where("link = :link", {link: link})
            .getOne()


        if (!post) {
            return res.status(404).send({
                message: "Пост не найден"
            })
        }

        delete post.includesSlider
        delete post.published
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
    } catch (e) {
        res.status(503).send({
            message: "Ошибка"
        })
    }
})

blogRouter.post('/post/create', checkValidAuth, async (req: Request, res: Response): Promise<any> => {
    try {
        const {model} = req.body
        const {headLine, text, includeSlider} = model
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

        const post = new Post()
        post.user = userFromDB
        post.text = text
        post.headLine = headLine
        post.includesSlider = includeSlider
        post.link = link
        post.suggested = !roleIncludes
        post.published = roleIncludes

        const postRepository = AppDataSource.getRepository(Post)
        const saved = await postRepository.save(post)

        return res.send(saved)
    } catch (e) {
        res.status(503).send({
            message: "Ошибка"
        })
    }
})

//@ts-ignore
blogRouter.delete('/post/delete/:link', checkValidAuth, async (req: Request, res: Response): Promise<any> => {
    try {
        const link = req.params.link

        const postRepository = AppDataSource.getRepository(Post)
        const post: any = await postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .where("link = :link", {link: link})
            .getOne()

        if (!post) {
            res.status(503).send({
                message: "Поста не существует"
            })
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

        if (userFromDB.id !== post.user.id) {
            if (!roleIncludes) {
                return res.status(403).send({
                    message: "роль не совпадает"
                })
            }
            return res.status(403).send({
                message: "Неверно указан пользователь"
            })
        }

        await postRepository.remove(post)

        return res.status(200).send({
            message: "Ok"
        })
    } catch (e) {
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

        if (userFromDB.id !== post.user.id) {
            if (!roleIncludes) {
                return res.status(403).send({
                    message: "роль не совпадает"
                })
            }
            return res.status(403).send({
                message: "Неверно указан пользователь"
            })
        }

        const linkTitle = translitRusEng(model.headLine, {loverCase: true, slug: true}).replaceAll('_', '-')

        post.text = model.text
        post.headLine = model.headLine
        post.includesSlider = model.includeSlider
        post.link = linkTitle

        const saved = await postRepository.save(post)

        res.status(200).send(saved)
    } catch (e) {
        console.log(e)

        res.status(503).send({
            message: "Ошибка"
        })
    }
})

export default blogRouter;

