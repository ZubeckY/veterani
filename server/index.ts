import cors from 'cors';
import config from './config';
import express from 'express';
import bodyParser from 'body-parser';
import controller from "./controllers";
import connectDataBase from "./connectDb";
import logger from "./modules/logger";

const app: express.Express = express()
const port = config.port

connectDataBase()

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(port, () => {
    try {
        logger.info('\x1b[34m%s\x1b[0m', '=> Server is running!')
        logger.info('\x1b[34m%s\x1b[0m', `=> PORT IS ${port}`)
    } catch (error) {
        logger.error('\x1b[31m%s\x1b[0m', `=> ❌  Server error: ${error}`);
    }
})

app.use('/api/', controller)

