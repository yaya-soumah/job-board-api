import { Op } from 'sequelize'

import { User } from './user.model'

export class UserRepository {
  static async createUser(data: any) {
    return User.create(data)
  }

  static async findUserById(id: number) {
    return User.findByPk(id)
  }

  static async findUserByEmail(email: string) {
    return User.scope('withPassword').findOne({ where: { email } })
  }

  static async findUserByUsername(username: string) {
    return User.findOne({ where: { username } })
  }

  static async findAllUsers(
    limit?: number,
    offset?: number,
    filters?: { authorId?: number; keyword?: string },
  ) {
    const where: any = {}
    if (filters?.authorId) where.authorId = filters.authorId
    if (filters?.keyword) where.content = { [Op.iLike]: `%${filters.keyword}` }

    return await User.findAndCountAll({
      where,
      limit,
      offset,
      attributes: { exclude: ['password'] },
    })
  }

  static async updateUserProfile(id: number, updates: Partial<User>) {
    return User.update(updates, { where: { id }, returning: true })
  }
}
