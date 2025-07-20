import { config } from 'dotenv'

import sequelize from './config/database.config'
import logger from './config/logger'
import app from './app.js'

config()

const PORT = process.env.PORT || 8080

async function startServer() {
  try {
    await sequelize.authenticate()
    if (process.env.NODE_ENV !== 'production') {
      logger.info('dev mode')
      await sequelize.sync({ alter: true })
      logger.info('using sequelize.sync for Dev/Test mode')
    }
    logger.info('Database connected successfuly')
    app.listen(PORT, () => {
      logger.info(`Server listening on http://localhost:${PORT}/api/v1/`)
    })
  } catch {
    logger.error('Failed to start')
  }
}
startServer()
