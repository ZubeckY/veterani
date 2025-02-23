import {Request, Response, Router} from "express";
import {onlyAdmin} from "../middleware/auth/onlyAdmin";
import {AppDataSource} from "../connectDb";
import {User} from "../entity";
import EmailService from "../service/emailService";

const emailService = new EmailService();
const adminRouter = Router()

/**
 * @swagger
 * /admin/user/block/{id}:
 *   post:
 *     summary: Блокировка или разблокировка пользователя
 *     description: Администратор может заблокировать или разблокировать пользователя по его ID.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя, которого нужно заблокировать/разблокировать
 *     responses:
 *       200:
 *         description: Статус блокировки успешно изменён
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Пользователь успешно заблокирован"
 *       400:
 *         description: Некорректный ID пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Некорректный ID пользователя"
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Пользователь не найден"
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ошибка операции"
 *     security:
 *       - BearerAuth: []
 */

adminRouter.post("/admin/user/block/:id", onlyAdmin, async (req: Request, res: Response): Promise<any> => {
    try {
        const {id} = req.params
        if (!(Number.isInteger(+id))) {
            return res
                .status(400)
                .send({
                    message: 'Не указан пользователь'
                })
        }

        const userRepository = AppDataSource.getRepository(User)
        const userBlock = await userRepository.findOneBy({id: +id})
        if (!userBlock) {
            return res.status(404).send({
                error: "Пользователь найден"
            })
        }

        userBlock.block = !(userBlock.block)
        await userRepository.save(userBlock);

        await emailService.sendEmailNotificationBlock(userBlock.email, userBlock.block)

        return res.status(200).send({ message: "Пользователь успешно " + (userBlock.block ? "заблокирован" : "разблокирован")});
    }
    catch (e) {
        return res
            .status(404)
            .send({
            message: "Ошибка операции"
        })
    }
});

adminRouter.post("admin/user/list", onlyAdmin, async (req: Request, res: Response): Promise<any> => {
    try {

    }
    catch (error) {

    }
})

export default adminRouter;