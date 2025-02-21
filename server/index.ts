import cors from 'cors';
import config from './config';
import express from 'express';
import bodyParser from 'body-parser';
import controller from "./controllers";
import connectDataBase from "./connectDb";
import logger from "./modules/logger";
import {setupSwagger} from "./swagger";
const app: express.Express = express()
const port = config.port

connectDataBase()
setupSwagger(app);

//app.use(cors());
app.set('trust proxy', true)
app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/', controller)

app.listen(port, () => {
    try {
        logger.info('\x1b[34m%s\x1b[0m', '=> Server is running!')
        logger.info('\x1b[34m%s\x1b[0m', `=> PORT IS ${port}`)
    } catch (error) {
        logger.error('\x1b[31m%s\x1b[0m', `=> ❌  Server error: ${error}`);
    }
})


