import {Request, Response, Router} from "express";
import {onlyAdmin} from "../../../middleware/auth/onlyAdmin";
import {AppDataSource} from "../../../connectDb";
import {MemberOrg} from "../../../entity";

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