import {Router, Request, Response} from "express";
import {checkRole} from "../../../middleware/auth/checkRole";
import {AppDataSource} from "../../../connectDb";
import {ContactInfo} from "../../../entity";

const contactInfoRouter = Router();

contactInfoRouter.get("/admin/contactInfo/get", async (req: Request, res: Response): Promise<any> => {
    try {
        const contactInfoRepository = AppDataSource.getRepository(ContactInfo)
        const contactInfo = await contactInfoRepository.find()

        return res.send(contactInfo)
    }
    catch (error) {
        console.log("Ошибка получения контактной информации")
        console.log(error);
    }
})

contactInfoRouter.post("/admin/contactInfo/false", checkRole, async (req: Request, res: Response): Promise<any> => {
    try {
        const contactInfo = req.body;

        const values = Object.values(contactInfo)
        for (let i = 1; i < values.length; i++) {
            if (String(values[i]).length <= 1) {
                return res.status(400).send({
                    message: "Пустое значение"
                })
            }
        }

        const contactInfoRepository = AppDataSource.getRepository(ContactInfo)
        await contactInfoRepository.save(contactInfo)

        return res.status(200).send({
            message: "Данные обновлены"
        })
    }
    catch (error) {
        console.log("Ошибка сохранения")
        console.log(error)
    }
})

contactInfoRouter.put("/admin/contactInfo/true", checkRole, async (req: Request, res: Response): Promise<any> => {
    try {
        const contactInfo = req.body;

        const values = Object.values(contactInfo)
        for (let i = 1; i < values.length; i++) {
            if (String(values[i]).length <= 1) {
                return res.status(400).send({
                    message: "Пустое значение"
                })
            }
        }

        const contactInfoRepository = AppDataSource.getRepository(ContactInfo)
        const contactInfoEntity: any = await contactInfoRepository.find()

        if(!contactInfoEntity.length) {
            return res.status(403).send({
                message: "Ошибка записи"
            })
        }
        const contactElement = contactInfoEntity[0]

        contactElement.phone = contactInfo.phone
        contactElement.email= contactInfo.email
        contactElement.address = contactInfo.address
        contactElement.mapping = contactInfo.mapping

        await contactInfoRepository.save(contactElement)

        return res.status(200).send({
            message: "Данные обновлены"
        })
    }
    catch (error) {
        console.log("Ошибка сохранения")
        console.log(error)
    }
})

export default contactInfoRouter;