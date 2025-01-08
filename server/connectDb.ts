import 'reflect-metadata'
import config from './config'
import logger from "./modules/logger"
import {Form} from "./entity"
import {DataSource} from 'typeorm'

export const AppDataSource: DataSource = new DataSource({
    type: config.DB_TYPE,
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
    // entities: ["./entity/**/*.ts"],
    entities: [Form],
    synchronize: true,
    logging: false,
})

export default function connectDataBase() {
    try {
        AppDataSource.initialize()
        logger.info('\x1b[34m%s\x1b[0m', '=> DB Connected!')
    } catch (error) {
        logger.error('\x1b[31m%s\x1b[0m', `=> ❌  Server error: ${error}`);
    }
}