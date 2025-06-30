import {Request, Response, Router} from "express";
import {checkValidAuth} from "../../middleware/auth/checkValidAuth";
import UploadService from "../../service/uploadService";
import {AppDataSource} from "../../connectDb";
import {File} from "../../entity"
import {onlyAdmin} from "../../middleware/auth/onlyAdmin";
import {FileTypeTranslator} from "../../types/fileType";

const fileRouter = Router();
const uploadService = new UploadService();

fileRouter.get("/admin/file/list", onlyAdmin, async (req: Request, res: Response): Promise<any> => {
    try {
        const fileRepository = AppDataSource.getRepository(File);
        const files = await fileRepository.find();

        const transformedFiles = files.map(file => {
            const { typeFile, ...rest } = file;
            console.log(FileTypeTranslator.translate(typeFile))
            return {
                ...rest,
                typeFile: FileTypeTranslator.translate(typeFile),

            };
        });

        return res.status(200).send({
            files: transformedFiles,
        });

    } catch (error) {
        console.error(error);
        return res.status(503).send({
            message: error instanceof Error ? error.message : 'Internal server error',
        });
    }
});

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