import {DictionaryValue} from "./DictionaryValue";

export enum FileType {
    /** images */
    imageJPEG = 'image/jpeg',
    imageJPG = 'image/jpg',
    imagePNG = 'image/png',
    imageAPNG = 'image/apng',
    imageGIF = 'image/gif',
    imageWEBP = 'image/webp',
    imageAVIF = 'image/avif',
    imageBMP = 'image/bmp',
    imageSVG = 'image/svg+xml',
    imageTIFF = 'image/tiff',
    /** zip files */
    fileRAR = 'application/vnd.rar',
    fileXTAR = 'application/x-tar',
    fileZIP = 'application/zip',
    fileXZIP = 'application/x-zip-compressed',
    file7ZIP = 'application/x-7z-compressed',
    /** text and office files */
    fileTXT = 'text/plain',
    fileDOC = 'application/msword',
    fileDOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileODP = 'application/vnd.oasis.opendocument.presentation',
    fileODS = 'application/vnd.oasis.opendocument.spreadsheet',
    fileCSV = 'application/vnd.oasis.opendocument.csv',
    fileODT = 'application/vnd.oasis.opendocument.text',
    filePDF = 'application/pdf',
    filePTT = 'application/vnd.ms-powerpoint',
    filePPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    fileXML = 'application/vnd.openxmlformats-officedocument.spreadsheetml.presentation',
    fileRTF = 'application/rtf',
    fileXLS = 'application/vnd.ms-excel',
    fileXLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

export class FileTypeTranslator {
    private static readonly translations: DictionaryValue<FileType> = {
        [FileType.imageJPEG]: 'JPEG изображение',
        [FileType.imageJPG]: 'JPG изображение',
        [FileType.imagePNG]: 'PNG изображение',
        [FileType.imageAPNG]: 'APNG изображение',
        [FileType.imageGIF]: 'GIF изображение',
        [FileType.imageWEBP]: 'WEBP изображение',
        [FileType.imageAVIF]: 'AVIF изображение',
        [FileType.imageBMP]: 'BMP изображение',
        [FileType.imageSVG]: 'SVG изображение',
        [FileType.imageTIFF]: 'TIFF изображение',

        [FileType.fileRAR]: 'RAR файл',
        [FileType.fileXTAR]: 'X-tar файл',
        [FileType.fileZIP]: 'Zip файл',
        [FileType.fileXZIP]: 'XZip файл',
        [FileType.file7ZIP]: '7z файл',

        [FileType.fileTXT]: 'TXT файл',
        [FileType.fileDOC]: 'DOC файл',
        [FileType.fileDOCX]: 'DOCX файл',
        [FileType.fileODP]: 'ODP презентация',
        [FileType.fileODS]: 'ODS таблица',
        [FileType.fileCSV]: 'CSV таблица',
        [FileType.fileODT]: 'ODT файл',
        [FileType.filePDF]: 'PDF файл',
        [FileType.filePTT]: 'PPT презентация',
        [FileType.filePPTX]: 'PPTX презентация',
        [FileType.fileXML]: 'XML файл',
        [FileType.fileRTF]: 'RTF файл',
        [FileType.fileXLS]: 'XLS таблица',
        [FileType.fileXLSX]: 'XLSX таблица',
    };

    static translate(mimeType: string): string {
        return this.translations[mimeType as FileType] ?? 'Неизвестный тип файла';
    }
}