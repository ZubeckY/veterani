import {Request, Response, Router} from "express";
import {AppDataSource} from "../../../connectDb";
import {Post} from "../../../entity";
import {checkRole} from "../../../middleware/auth/checkRole";


const adminBlogRouter = Router();

adminBlogRouter.get('/admin/post/list', checkRole,async (req: Request, res: Response): Promise<any> => {
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

//todo
adminBlogRouter.delete('/admin/post/delete/:id', checkRole, async (req: Request, res: Response): Promise<any> => {
    try {
        const {id} = req.params
        if (!(Number.isInteger(+id))) {
            return res.status(404).send({
                message: "Пользователь не выбран"
            })
        }

        const postRepository = AppDataSource.getRepository(Post)
        const post: any = await postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .where("id = :id", {id: id})
            .getOne()

        if (!post) {
            return res.status(503).send({
                message: "Поста не существует"
            })
        }
        console.log(post)
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

export default adminBlogRouter;
