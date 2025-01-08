import log4js from 'log4js'

const logger: log4js.Logger = log4js.getLogger()
logger.level = process.env.LOG_LEVEL || 'debug'

export default logger