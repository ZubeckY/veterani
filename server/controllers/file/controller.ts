import {Request, Response, Router} from "express";
import {checkValidAuth} from "../../middleware/auth/checkValidAuth";
import UploadService from "../../service/uploadService";
import {AppDataSource} from "../../connectDb";
import {File} from "../../entity"

const fileRouter = Router();
const uploadService = new UploadService();

fileRouter.post("/file/upload", checkValidAuth, uploadService.upload("file"), async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.file) {
            console.log('нет файла')
        }

        const fileFromReq: any = req.file;
        const fileType = fileFromReq.mimetype
        const path: any = fileFromReq.path

        if (fileType.split("/")[0] === 'image') {
            await uploadService.sharpImage(path)
        }

        const fileRepository = AppDataSource.getRepository(File)
        const file = new File()

        file.name = fileFromReq.filename
        file.typeFile = fileType
        file.path = path
        file.published = false
        file.used = false

        const savedFile = await fileRepository.save(file)
        return res
            .status(200)
            .send({
                file: savedFile,
                message: "Файл успешно сохранён"
            })
    } catch (error) {
        console.log(error)
        return res.status(503).send({
            message: error
        })
    }
})

export default fileRouter;