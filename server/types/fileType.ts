import {DictionaryValue} from "./DictionaryValue";

export enum FileType {
    jpeg = 'image/jpeg',
    jpg ='image/jpg',
    png = 'image/png',
    apng = 'image/apng',
    gif = 'image/gif',
    webp = 'image/webp',
    avif = 'image/avif',
    bmp = 'image/bmp',
    svg = 'image/svg+xml',
    tiff = 'image/tiff',
}

export const fileTypeText : DictionaryValue<FileType> = {
    [FileType["jpeg"]]: 'JPEG изображение',
    [FileType["jpg"]]: 'JPG изображение',
    [FileType["png"]]: 'PNG изображение',
    [FileType["apng"]]: 'APNG изображение',
    [FileType["gif"]]: 'GIF изображение',
    [FileType["webp"]]: 'WEBP изображение',
    [FileType["avif"]]: 'AVIF изображение',
    [FileType["bmp"]]: 'BMP изображение',
    [FileType["svg"]]: 'SVG изображение',
    [FileType["tiff"]]: 'TIFF изображение',
}