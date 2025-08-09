import {Request, Response, Router} from "express";
import {onlyAdmin} from "../../../middleware/auth/onlyAdmin";
import {AppDataSource} from "../../../connectDb";
import {User} from "../../../entity";
import EmailService from "../../../service/emailService";
import {checkRole} from "../../../middleware/auth/checkRole";
import {Role, roleTypeText} from "../../../types/role";
import AdminUser from "../../../DTOS/admin.user";
import AuthService from "../../../service/authService";

const emailService = new EmailService();
const adminRouter = Router()

adminRouter.post("/admin/user/edit/:id", onlyAdmin, async (req: Request, res: Response): Promise<any> => {
    try {
        const {id} = req.params
        if (!(Number.isInteger(+id))) {
            return res
                .status(400)
                .send({
                    message: 'Не указан пользователь'
                })
        }

        const body = req.body;

        const cookies = req.headers['cookie']
        const currentUser: any = await new AuthService().getUserFromCookies(cookies)

        const userRepository = AppDataSource.getRepository(User)
        const userFromDB = await userRepository.findOneBy({id: +id})
        if (!userFromDB) {
            return res.status(404).send({
                error: "Пользователь не найден"
            })
        }

        if (userFromDB.id != currentUser.id) {
            if (userFromDB.activated != body.activated) {
                userFromDB.activated = body.activated
            }
            if (userFromDB.role != body.role) {
                userFromDB.role = body.role
            }
            if (userFromDB.block != body.block) {
                userFromDB.block = body.block
                await emailService.sendEmailNotificationBlock(userFromDB.email, userFromDB.block ?? false)
            }
        } else {
            return res
                .status(200)
                .send({
                    message: 'Нельзя изменить параметры самому себе!'
                })
        }

        await userRepository.save(userFromDB);

        return res
            .status(200)
            .send({message: 'ok'})
    } catch (error) {
        console.log(error)

        return res
            .status(404)
            .send({
                message: "Ошибка операции"
            })
    }
});

adminRouter.get("/admin/user/list", checkRole, async (req: Request, res: Response): Promise<any> => {
    try {
        const skip = (+(req.query?.page ?? 1) - 1) * +(req.query?.size ?? 10);
        const take = +(req.query?.size ?? 10);

        const userRepository = AppDataSource.getRepository(User);

        const usersFromDB = await userRepository.find({
            skip,
            take
        });

        const users = usersFromDB.map(user => new AdminUser({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            created: user.created,
            activated: user.activated,
            block: user.block
        }));

        return res.status(200).json({users});
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

adminRouter.delete('/admin/user/delete/:id', checkRole, async (req: Request, res: Response): Promise<any> => {
    try {
        const currentUser: any = await new AuthService().getUserFromCookies(req.headers['cookie'])
        if (!currentUser.id) {
            return currentUser
        }

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

        const ourRole = currentUser.role
        const deletedUserRole = userFromDB.role

        if (userFromDB.id == currentUser.id) {
            return res
                .status(403)
                .send({
                    message: 'Нельзя удалить себя!'
                })
        }

        if (ourRole != Role.admin && deletedUserRole == Role.admin) {
            return res
                .status(403)
                .send({
                    message: 'Нельзя удалить пользователя с текущей ролью'
                })
        }

        if (ourRole == Role.admin && deletedUserRole == Role.admin) {
            return res
                .status(403)
                .send({
                    message: 'Для удаления пользователя нужно создать голосование'
                })
        }


        await userRepository.delete({id: +id})
        await emailService.sendEmailNotificationDelete(userFromDB.email)

        return res.status(200).send({message: "Пользователь успешно удалён"});
    } catch (error) {
        console.log(error)
        return res
            .send({
                message: 'Не удалось удалить пользователя'
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