require('dotenv').config()
import config from './config';
import express from 'express';
import bodyParser from 'body-parser';
import controller from "./controllers";
import connectDataBase, {AppDataSource} from "./connectDb";
import logger from "./modules/logger";
import {setupSwagger} from "./swagger";
import {File} from './entity'

const app: express.Express = express()
const port = config.port

app.set('trust proxy', true)

app.use(express.json());
app.use(express.urlencoded({extended: true,}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true,}))

app.use('/api/media/', express.static('uploads'));
app.use('/api/', controller)

const fileWatcher = (switcher: boolean) => {
    try {
        const timer: number = 6 * 60 * 60 * 1000 // час * мин * сек * мс

        const interval = setInterval(async () => {
            if (!switcher) {
                return clearInterval(interval);
            }

            await findUnusedFilesAndDelete()

        }, timer)

    } catch (error) {
    }
}


async function findUnusedFilesAndDelete() {
    try {
        const fileRepository = AppDataSource.getRepository(File);
        const files = await fileRepository.find({
            where: {
                used: false,
            }
        })

        if (files.length === 0) {
            return logger.info('\x1b[34m%s\x1b[0m', 'Неиспользуемые файлы не найдены') // Пока выводим в консоль, хз
        }

        const pathList = []
        for (let i = 0; i < files.length; i++) {
            let path = files[i].path
            pathList.push(path)
        }

    } catch (error) {
    }
}


app.listen(port, () => {
    try {
        logger.info('\x1b[34m%s\x1b[0m', '=> Server is running!')
        logger.info('\x1b[34m%s\x1b[0m', `=> PORT IS ${port}`)
        connectDataBase()
        setupSwagger(app)
    } catch (error) {
        logger.error('\x1b[31m%s\x1b[0m', `=> ❌  Server error: ${error}`);
    }
})


