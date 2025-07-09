import {Request, Response, Router} from "express";
import {onlyAdmin} from "../../../middleware/auth/onlyAdmin";
import {AppDataSource} from "../../../connectDb";
import {User} from "../../../entity";
import {OrgRole} from "../../../types/orgRole";
import MemberUser from "../../../DTOS/member.user";

const memberOrgController = Router()

memberOrgController.get("/admin/members/list", onlyAdmin, async (req: Request, res: Response): Promise<any> => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const membersListFromDB = await userRepository.find({
            where: {
                memberRole: OrgRole.member
            }
        })

        const users = membersListFromDB.map(user => new MemberUser({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            memberRole: user.memberRole,
            memberRoleTitle: user.memberRoleTitle,
        }));

        return res
            .status(200)
            .send(users);

    } catch (error) {
        console.log(error);

        return res
            .status(501)
            .send({
                message: 'Ошибка запроса'
            })
    }
})

memberOrgController.get("/admin/members/users", onlyAdmin, async (req: Request, res: Response): Promise<any> => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const membersListFromDB = await userRepository.find({
            where: {
                memberRole: OrgRole.user
            }
        })

        const users = membersListFromDB.map(user => new MemberUser({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            memberRole: user.memberRole,
            memberRoleTitle: user.memberRoleTitle,
        }));

        return res
            .status(200)
            .send(users);

    } catch (error) {
        return res
            .status(501)
            .send({
                message: 'Ошибка запроса'
            })
    }
})

memberOrgController.post("/admin/members/create", onlyAdmin, async (req: Request, res: Response): Promise<any> => {
    try {
        const {id, memberRole} = req.body

        if (!(Number.isInteger(+id))) {
            return res.status(404).send({
                message: "Пользователь не выбран"
            })
        }

        const userRepository = AppDataSource.getRepository(User);
        const userFromDB = await userRepository.findOne({
            where: {id: +id}
        })

        if (!userFromDB) {
            return res.status(404).send({
                message: "Пользователь не выбран"
            })
        }

        userFromDB.memberRole = OrgRole.member
        userFromDB.memberRoleTitle = memberRole

        await userRepository.save(userFromDB)

        return res.send({
            message: 'ok'
        })
    } catch (error) {
        return res
            .status(501)
            .send({
                message: 'Ошибка запроса'
            })
    }
})

memberOrgController.post("/admin/members/edit", onlyAdmin, async (req: Request, res: Response): Promise<any> => {
    try {
        const {id, memberRole} = req.body

        if (!(Number.isInteger(+id))) {
            return res.status(404).send({
                message: "Пользователь не выбран"
            })
        }

        const userRepository = AppDataSource.getRepository(User);
        const userFromDB = await userRepository.findOne({
            where: {id: +id}
        })

        if (!userFromDB) {
            return res.status(404).send({
                message: "Пользователь не выбран"
            })
        }

        userFromDB.memberRoleTitle = memberRole

        await userRepository.save(userFromDB)

        return res.send({
            message: 'ok'
        })
    } catch (error) {
        return res
            .status(501)
            .send({
                message: 'Ошибка запроса'
            })
    }
})

memberOrgController.post("/admin/members/delete", onlyAdmin, async (req: Request, res: Response): Promise<any> => {
    try {
        const {id} = req.body

        if (!(Number.isInteger(+id))) {
            return res.status(404).send({
                message: "Пользователь не выбран"
            })
        }

        const userRepository = AppDataSource.getRepository(User);
        const userFromDB = await userRepository.findOne({
            where: {id: +id}
        })

        if (!userFromDB) {
            return res.status(404).send({
                message: "Пользователь не выбран"
            })
        }

        userFromDB.memberRole = OrgRole.user
        userFromDB.memberRoleTitle = undefined

        await userRepository.save(userFromDB)

        return res.send({
            message: 'ok'
        })
    } catch (error) {
        return res
            .status(501)
            .send({
                message: 'Ошибка запроса'
            })
    }
})

export default memberOrgController