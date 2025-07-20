import sequelize from '../config/database.config'
import { User } from '../components/user/user.model'

beforeAll(async () => {
  await sequelize.sync({ force: true }) // Only for test
})

afterEach(async () => {
  // Optional: truncate tables between tests
  await User.destroy({ where: {} })
})

afterAll(async () => {
  await sequelize.close()
})
