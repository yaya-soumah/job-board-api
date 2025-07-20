import { Sequelize } from 'sequelize-typescript'
import { config } from 'dotenv'

import { models } from '../components/models/index'
config()

const isTest = process.env.NODE_ENV === 'test'

const sequelize = isTest
  ? new Sequelize({
      dialect: 'sqlite',
      storage: process.env.TEST_DB_STORAGE || ':memory:',
      models,
      logging: false,
    })
  : new Sequelize({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      models,
      logging: false,
    })

export default sequelize
