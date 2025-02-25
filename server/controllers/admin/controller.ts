import {Request, Response, Router} from "express";
import {onlyAdmin} from "../../middleware/auth/onlyAdmin";
import {AppDataSource} from "../../connectDb";
import {User} from "../../entity";
import EmailService from "../../service/emailService";
import {checkRole} from "../../middleware/auth/checkRole";
import {Role, roleTypeText} from "../../types/role";
import AdminUser from "../../DTOS/admin.user";

const emailService = new EmailService();
const adminRouter = Router()

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

        return res.status(200).send({message: "Пользователь успешно " + (userBlock.block ? "заблокирован" : "разблокирован")});
    } catch (error) {
        return res
            .status(404)
            .send({
                message: "Ошибка операции"
            })
    }
});

adminRouter.get("admin/user/list", checkRole, async (req: Request, res: Response): Promise<any> => {
    try {
        const userRepository = AppDataSource.getRepository(User);

        const usersFromDB = await userRepository.find();

        const users = usersFromDB.map(user => {
            const DTO = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                created: user.created,
                activated: user.activated,
                block: user.block
            };

            return new AdminUser(DTO);
        });

        return res.status(200).send({
            users
        })

    } catch (error) {
        console.log(error)
        return res
            .send({
                message: 'error'
            })
    }
})

adminRouter.get('/admin/user/:id', checkRole, async (req: Request, res: Response): Promise<any> => {
    try {
        const {id} = req.params
        if (!(Number.isInteger(+id))) {
            return res.status(404).send({
                message: "Пользователь не выбран"
            })
        }

        const userRepository = AppDataSource.getRepository(User);
        const userFromDB = await userRepository.findOneBy({id: +id});
        if (!userFromDB) {
            return res.status(404).send({
                message: "Пользователь с таким id не найден"
            })
        }

        const DTO = {
            id: userFromDB.id,
            firstName: userFromDB.firstName,
            lastName: userFromDB.lastName,
            email: userFromDB.email,
            role: userFromDB.role,
            created: userFromDB.created,
            activated: userFromDB.activated,
            block: userFromDB.block
        };

        const userDTO = new AdminUser(DTO);

        return res.status(200).send({
            userDTO
        })

    } catch (error) {
        console.log(error)
        return res
            .send({
                message: 'error'
            })
    }
})

adminRouter.post('/admin/user/role-list/', async (req: Request, res: Response): Promise<any> => {
    try {
        const roles = [
            {
                key: Role.admin,
                value: roleTypeText[Role.admin],
            },
            {
                key: Role.manager,
                value: roleTypeText[Role.manager],
            },
            {
                key: Role.user,
                value: roleTypeText[Role.user],
            },
            {
                key: Role.guest,
                value: roleTypeText[Role.guest],
            },
        ]

        return res
            .status(200)
            .send({roles})
    } catch (error) {
        console.log(error)
        return res
            .send({
                message: 'error'
            })
    }
})

export default adminRouter;