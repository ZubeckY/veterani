import {Request, Response, Router} from "express";
import {onlyAdmin} from "../../../middleware/auth/onlyAdmin";
import {AppDataSource} from "../../../connectDb";
import {MemberOrg, User} from "../../../entity";

const memberOrgController = Router()

export default memberOrgController

memberOrgController.get("/admin/members/list", onlyAdmin, async (req: Request, res: Response): Promise<any> => {
    try {
        const memberOrgRepository = AppDataSource.getRepository(MemberOrg)
        const memberOrg = await memberOrgRepository.find()

        return res
            .status(200)
            .send(memberOrg)
    } catch (error) {
        return res
            .status(501)
            .send({
                message: "Ошибка операции"
            })
    }
})

memberOrgController.post("/admin/members/create", onlyAdmin, async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.body.id;
        const memberRole = req.body.memberRole;

        const userRepository = AppDataSource.getRepository(User);
        const userFromDB:User|null = await userRepository.findOneBy(id);
        if(userFromDB == null) {
            return res
                .status(401)
                .send({
                    message: "Такого пользователя нет"
                })
        }

        if(userFromDB.role == "admin" || userFromDB.role == "manager") {
            const memberOrgRepository = AppDataSource.getRepository(MemberOrg)

            const member = {
                id: id,
                memberRole: memberRole
            }

            memberOrgRepository.save(member);

            return res
                .status(200)
                .send({
                    message: "Пользователь добавлен в команду"
                })
        } else {
            return res
                .status(401)
                .send({
                    message: "У пользователя неправильная роль"
                })
        }
    } catch (error) {
        return res
            .status(501)
            .send({
                message: "Ошибка"
            })
    }
})

memberOrgController.post("/admin/members/delete", onlyAdmin, async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.body.id;

        const userRepository = AppDataSource.getRepository(User);
        const userFromDB:User|null = await userRepository.findOneBy(id);
        if(userFromDB == null) {
            return res
                .status(401)
                .send({
                    message: "Такого пользователя нет"
                })
        }

        if(userFromDB.role == "admin" || userFromDB.role == "manager") {
            const memberOrgRepository = AppDataSource.getRepository(MemberOrg)

            memberOrgRepository.delete(id);

            return res
                .status(200)
                .send({
                    message: "Пользователь удален из команды"
                })
        }
    } catch (error) {
        return res
            .status(501)
            .send({
                message: "Ошибка"
            })
    }
})