import sharp from "sharp"
import multer from "multer"
import * as uuid from 'uuid'

export default class UploadService {
    uploadImage = (fieldName: string) => {
        return multer({
            storage: multer.diskStorage({
                destination: 'uploads/',
                filename: function (req, file, callback) {
                    const ext = file.originalname.substring(
                        file.originalname.lastIndexOf("."),
                        file.originalname.length
                    );

                    const date: any = new Date().toLocaleDateString("ru", {
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric',
                    })

                    const normDate = date.toString().replaceAll('-', '.')
                    const fullNameVal = normDate + '-' + uuid.v4() + ext

                    callback(null, fullNameVal)
                }
            }),

            limits: {
                fileSize: 50 * 1024 * 1024
            },

            fileFilter: (req: Express.Request, file: Express.Multer.File, cb: Function) => {
                if (file.mimetype.split("/")[0] === 'image') {
                    cb(null, true);
                } else {
                    cb(new Error('Only JPEG and PNG images are allowed.'), false);
                }
            }
        }).single(fieldName);
    }

    async sharpImage(file: any) {
        const sharpImage = sharp(file)
        const metadata = await sharpImage.metadata()

        const roundValue = (value: number): number => {
            return Math.ceil(value! * 50 / 100)
        }

        return await sharpImage.resize({
            width: roundValue(Number(metadata.width)),
            height: roundValue(Number(metadata.height)),
            fit: "inside",
        }).toBuffer()
    }
};