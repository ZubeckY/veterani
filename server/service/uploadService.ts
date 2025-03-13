import multer from "multer"
import {Request, Response} from "express"
import sharp from "sharp"
import uuid from "uuid"

export default class UploadService {



     storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, '/uploads')
        },
        filename: function (req, file, cb) {
            const date: any = new Date().toLocaleDateString("ru", {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
            })

            const normDate = date.toString().replaceAll('-','.')

            cb(null, normDate+ '-' + uuid.v4())
        }
    })

    filterImage (req: Request, file: any, cb: any){
        if (file.mimetype.split("/")[0] === 'image') {
            cb(null, true);
        } else {
            cb(new Error("Only images are allowed!"));
        }
    }

    async sharp(file: any){
        const sharpImage = sharp(file)
        const metadata = await sharpImage.metadata()
        return await sharpImage.resize({
            width: Math.ceil(metadata.width! * 50 / 100),
            height: Math.ceil(metadata.height! * 50 / 100),
            fit: "inside",
        }).toBuffer()
    }

    upload = multer ({
        storage: this.storage,
        fileFilter: this.filterImage,
        limits: {
            fileSize: 50 * 1024 * 1024
        }
    })
}
