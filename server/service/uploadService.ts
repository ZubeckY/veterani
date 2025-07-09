import sharp from "sharp"
import multer from "multer"
import * as uuid from 'uuid'
import * as fs from "fs"

export default class UploadService {
    upload = (fieldName: string) => {
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

                    const normDate = date.toString().replaceAll('.', '-')
                    const fullNameVal = normDate + '-' + uuid.v4() + ext

                    callback(null, fullNameVal)
                }
            }),
            limits: {
                fileSize: 50 * 1024 * 1024
            },
            fileFilter: (req: Express.Request, file: Express.Multer.File, cb: Function) => {
                const requiredFileTypes: any = [
                    // image files
                    'image/jpeg',
                    'image/jpg',
                    'image/png',
                    'image/gif',
                    'image/webp',
                    'image/avif',
                    'image/apng',
                    'image/bmp',
                    'image/svg+xml',
                    'image/tiff',
                    // zip files
                    'application/vnd.rar',
                    'application/x-tar',
                    'application/zip',
                    'application/x-zip-compressed',
                    'application/x-7z-compressed',
                    // text and office files
                    'text/plain',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.oasis.opendocument.presentation',
                    'application/vnd.oasis.opendocument.spreadsheet',
                    'application/vnd.oasis.opendocument.csv',
                    'application/vnd.oasis.opendocument.text',
                    'application/pdf',
                    'application/vnd.ms-powerpoint',
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.presentation',
                    'application/rtf',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ]
                if (requiredFileTypes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new Error('Файл не поддерживается!'), false);
                }
            }
        })
    }

    uploadSingle(fieldName: string) {
        return this.upload(fieldName).single(fieldName)
    }

    uploadMultiple(fieldName: string) {
        return this.upload(fieldName).array(fieldName)
    }

    async sharpImage(path: any) {
        const sharpImage = sharp(path)
        const metadata = await sharpImage.metadata()

        const roundValue = (value: number): number => {
            return Math.ceil(value! * 50 / 100)
        }

        const width = roundValue(Number(metadata.width))
        const height = roundValue(Number(metadata.height))

        const compressedImageBuffer: any = await sharpImage
            .resize(width, height)
            .jpeg({quality: 80})
            .toBuffer()

        return this.save(path, compressedImageBuffer)
    }

    save(path: string, data: any) {
        return fs.writeFileSync(path, data);
    }
};