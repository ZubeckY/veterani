import {Router, Request, Response, NextFunction} from "express";
import {Post} from "../entity";
import {AppDataSource} from "../connectDb";
import {checkValidAuth} from "../middleware/userMiddleware";
import AuthService from "../service/authService";

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
    }
    catch (e) {
        console.error(e);
    }
})

//@ts-ignore
blogRouter.post('/post/create', checkValidAuth, async (req: Request, res: Response): Promise<any> => {
    try {
        const {model} = req.body
        const {headLine, text, includeSlider}  = model
        const values = Object.values(model)

        for (let i = 1; i < values.length; i++) {
            if (String(values[i]).length <= 1) {
                return res.status(400).send({
                    message: "Пустое значение"
                })
            }
        }

        const accessToken:any = req.headers['authorized'];
        const userFromDB:any = await new AuthService().getUserByToken(accessToken)

        if (!userFromDB) {
            res.status(401).send({
                message: "user undefind"
            })
        }

        const post = new Post()
        post.user = userFromDB
        post.text = text
        post.headLine = headLine
        post.includesSlider = includeSlider

        const postRepository = AppDataSource.getRepository(Post)
        const saved = await postRepository.save(post)

        return res.send(saved)
    }
    catch (e) {
        console.error(e);
    }
})

export default blogRouter;

