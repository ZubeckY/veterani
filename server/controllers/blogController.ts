import {Router, Request, Response} from "express";
import {Post} from "../entity";
import {AppDataSource} from "../connectDb";
import {checkValidAuth} from "../middleware/auth/checkValidAuth";
import AuthService from "../service/authService";
//@ts-ignore
import translitRusEng from 'translit-rus-eng'

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
        const post = await postRepository.findOneBy({link})

        return res.send(post)
    } catch (e) {
        res.status(503).send({
            message: "Ошибка"
        })
    }
})

//@ts-ignore
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

        const link = translitRusEng(headLine, {loverCase: true, slug: true}).replaceAll('_', '-')

        const post = new Post()
        post.user = userFromDB
        post.text = text
        post.headLine = headLine
        post.includesSlider = includeSlider
        post.link = link

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
        const post: any = await postRepository.findOneBy({link})

        if (!post) {
            res.status(503).send({
                message: "Поста не существует"
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
        const info = req.body

        const postRepository = AppDataSource.getRepository(Post)
        const post: any = await postRepository.findOneBy({link})

        if (!post) {
            res.status(403).send({
                message: "Нет такого поста"
            })
        }

        const linkTitle = translitRusEng(info.headLine, {loverCase: true, slug: true}).replaceAll('_', '-')

        post.text = info.text
        post.headLine = info.headLine
        post.includesSlider = info.includeSlider
        post.link = linkTitle

        const saved = await postRepository.save(post)

        res.status(200).send(saved)
    } catch (e) {
        res.status(503).send({
                message: "Ошибка"
            })
    }
})

export default blogRouter;

