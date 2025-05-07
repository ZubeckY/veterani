import {Request, Response, Router} from "express";
import {AppDataSource} from "../../connectDb";
import {ContactInfo} from "../../entity";

const contInfoRouter = Router();

contInfoRouter.get("/contactInfo/get", async (req: Request, res: Response): Promise<any> => {
    try {
        const contactInfoRepository = AppDataSource.getRepository(ContactInfo)
        const contactInfo = await contactInfoRepository.find()

        return res.send(contactInfo)
    } catch (error) {
        console.log("Ошибка получения контактной информации")
        console.log(error);
    }
})

export default contInfoRouter;