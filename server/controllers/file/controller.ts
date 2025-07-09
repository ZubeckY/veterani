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

fileRouter.post("/file/upload/multiple/", checkValidAuth, uploadService.uploadMultiple("files"), async (req: Request, res: Response): Promise<any> => {
    try {
        const files = req.files as Express.Multer.File[];
        if (!files) {
            return res.status(400).send('Не загружено ни одного файла.');
        }

        const fileRepository = AppDataSource.getRepository(File)
        const savedFiles = []

        for (let i = 0; i < files.length; i++) {
            const FILE = files[i];

            const fileType = FILE.mimetype
            const path: any = FILE.path

            if (fileType.split("/")[0] === 'image') {
                await uploadService.sharpImage(path)
            }

            const file = new File()

            file.name = FILE.filename
            file.typeFile = fileType
            file.path = path
            file.published = false
            file.used = false

            const savedFile = await fileRepository.save(file)
            savedFiles.push(savedFile)
        }

        return res
            .status(200)
            .send({
                files: savedFiles,
                message: "Файл успешно сохранён"
            })

    } catch (error) {
        console.error(error);
    }
})

fileRouter.post("/file/upload/single/", checkValidAuth, uploadService.uploadSingle("file"), async (req: Request, res: Response): Promise<any> => {
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

fileRouter.delete("/admin/file/delete/:id", onlyAdmin, async (req: Request, res: Response): Promise<any> => {
    try {
        const {id} = req.params
        if (!(Number.isInteger(+id))) {
            return res.status(404).send({
                message: "Пользователь не выбран"
            })
        }

        const fileRepository = AppDataSource.getRepository(File);
        const files = await fileRepository.findOneBy({id: +id});
        console.log(files)
        if (!files) {
            return res.status(404).send({
                message: "Файл с таким id не найден"
            })
        }

        await fileRepository.delete({id: +id})
        return res.status(200).send({message: "Файл успешно удалён"});

    } catch (error) {
        console.error(error);
        return res.status(503).send({
            message: error instanceof Error ? error.message : 'Internal server error',
        });
    }
});

fileRouter.patch("/admin/file/edit/:id", onlyAdmin, async (req: Request, res: Response): Promise<any> => {
    try {
        const {id} = req.params
        if (!(Number.isInteger(+id))) {
            return res.status(404).send({
                message: "Пользователь не выбран"
            })
        }

        const {name, published} = req.body;

        const fileRepository = AppDataSource.getRepository(File);
        const files = await fileRepository.findOneBy({id: +id});

        console.log(files)

        if (!files) {
            return res.status(404).send({
                message: "Файл с таким id не найден"
            })
        }

        files.name = name;
        files.published = published;

        await fileRepository.save(files)
        return res.status(200).send({message: "Файл успешно обновлен"});

    } catch (error) {
        console.error(error);
        return res.status(503).send({
            message: error instanceof Error ? error.message : 'Internal server error',
        });
    }
});

export default fileRouter;