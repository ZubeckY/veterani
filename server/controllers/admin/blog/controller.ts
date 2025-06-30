import {Request, Response, Router} from "express";
import {AppDataSource} from "../../../connectDb";
import {Post} from "../../../entity";
import blogRouter from "../../blog/controller";
import {checkValidAuth} from "../../../middleware/auth/checkValidAuth";
import AuthService from "../../../service/authService";
import adminRouter from "../user/controller";
import {FileTypeTranslator} from "../../../types/fileType";


const adminBlogRouter = Router();

adminBlogRouter.get('/admin/post/list', async (req: Request, res: Response): Promise<any> => {
    try {
        const skip = (+(req.query?.page ?? 1) - 1) * +(req.query?.size ?? 10)
        const takePage = +(req.query?.page ?? 1) * +(req.query?.size ?? 10)
        const give = +(req.query?.give ?? 10)
        const take = takePage ?? give

        const postRepository = AppDataSource.getRepository(Post)
        const post = await postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .skip(skip)
            .take(take)
            .getMany()

        return res.send(post)
    } catch (error) {
        res.status(503).send({
            message: "Ошибка"
        })
    }
})

adminBlogRouter.delete('/admin/post/delete/:link', checkValidAuth, async (req: Request, res: Response): Promise<any> => {
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

        await postRepository.remove(post)
        return res
            .status(200)
            .send({
                message: "Ok"
            })
    } catch (error) {
        res.status(503).send({
            message: "Ошибка"
        })
    }
})

export default adminBlogRouter;
