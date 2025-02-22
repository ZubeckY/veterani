import {Router, Request, Response} from "express";
import {Post} from "../entity";
import {AppDataSource} from "../connectDb";
import {checkValidAuth} from "../middleware/auth/checkValidAuth";
import AuthService from "../service/authService";
//@ts-ignore
import translitRusEng from 'translit-rus-eng'
import {Role} from "../types/role";

const blogRouter = Router();

/**
 * @swagger
 * /post/getMany:
 *   get:
 *     summary: Получить список постов
 *     description: Возвращает список опубликованных постов с пагинацией.
 *     tags: [Blogs]  # Группа для постов
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Количество страниц (по умолчанию 1)
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Количество постов на странице (по умолчанию 10)
 *     responses:
 *       200:
 *         description: Список постов успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   headLine:
 *                     type: string
 *                     example: "Заголовок поста"
 *                   text:
 *                     type: string
 *                     example: "Текст поста"
 *                   published:
 *                     type: boolean
 *                     example: true
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 5
 *                       firstName:
 *                         type: string
 *                         example: "user123"
 *                       lastName:
 *                          type: string
 *                          example: "user123"
 *       503:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ошибка"
 */

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

/**
 * @swagger
 * /post/:link:
 *   get:
 *     summary: Получить отдельный пост
 *     description: Возвращает один пост по его уникальному идентификатору (ссылке)
 *     tags: [Blogs]  # Группа для постов
 *     parameters:
 *       - in: params
 *         name: link
 *         schema:
 *           type: string
 *         description: Уникальная ссылка (ID) поста
 *     responses:
 *       200:
 *         description: Пост успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "Заголовок поста"
 *                 content:
 *                   type: string
 *                   example: "Текст поста"
 *                 author:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 42
 *                     name:
 *                       type: string
 *                       example: "Иван Иванов"
 *       404:
 *         description: Пост не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Пост не найден"
 *       503:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ошибка"
 */

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

/**
 * @swagger
 * /post/create:
 *   post:
 *     summary: Создать новый пост
 *     description: Доступно только для авторизованных пользователей (менеджеров и администраторов). Пост может быть опубликован сразу или отправлен на модерацию.
 *     tags: [Blogs]  # Группа для постов
 *     security:
 *       - cookieAuth: []  # Передача токена через куки
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model:
 *                 type: object
 *                 properties:
 *                   headLine:
 *                     type: string
 *                     example: "Заголовок поста"
 *                   text:
 *                     type: string
 *                     example: "Текст поста"
 *                   includeSlider:
 *                     type: boolean
 *                     example: true
 *     responses:
 *       200:
 *         description: Пост успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 headLine:
 *                   type: string
 *                   example: "Заголовок поста"
 *                 text:
 *                   type: string
 *                   example: "Текст поста"
 *                 link:
 *                   type: string
 *                   example: "zagolovok-posta"
 *                 published:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Некорректные данные (пустые поля)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Пустое значение"
 *       401:
 *         description: Пользователь не авторизован или нет доступа
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Токен не найден. Код ошибки - 1020"
 *       503:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ошибка"
 */

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

/**
 * @swagger
 * /post/delete/:link:
 *   delete:
 *     summary: Удалить пост
 *     description: Удалить пост может только его автор или администратор/менеджер.
 *     tags: [Blogs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: params
 *         name: link
 *         required: true
 *         schema:
 *           type: string
 *         description: Уникальный id поста
 *     responses:
 *       200:
 *         description: Пост успешно удалён
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ok"
 *       401:
 *         description: Пользователь не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Токен не найден. Код ошибки - 1020"
 *       403:
 *         description: У пользователя нет прав на удаление поста
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "роль не совпадает"
 *       404:
 *         description: Пост не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Поста не существует"
 *       503:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ошибка"
 */

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

/**
 * @swagger
 * /post/update/:link:
 *   patch:
 *     summary: Обновить пост
 *     description: Обновление поста доступно только его автору или администратору/менеджеру.
 *     tags: [Blogs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: params
 *         name: link
 *         required: true
 *         schema:
 *           type: string
 *         description: Уникальный id поста
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model:
 *                 type: object
 *                 properties:
 *                   headLine:
 *                     type: string
 *                     example: "Обновленный заголовок"
 *                   text:
 *                     type: string
 *                     example: "Обновленный текст поста"
 *                   includeSlider:
 *                     type: boolean
 *                     example: false
 *     responses:
 *       200:
 *         description: Пост успешно обновлён
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 headLine:
 *                   type: string
 *                   example: "Обновленный заголовок"
 *                 text:
 *                   type: string
 *                   example: "Обновленный текст поста"
 *                 link:
 *                   type: string
 *                   example: "obnovlennyj-zagolovok"
 *                 includesSlider:
 *                   type: boolean
 *                   example: false
 *       401:
 *         description: Пользователь не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Токен не найден. Код ошибки - 1020"
 *       403:
 *         description: Нет прав на обновление поста
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "роль не совпадает"
 *       404:
 *         description: Пост не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Нет такого поста"
 *       503:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ошибка"
 */


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

