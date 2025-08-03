import { Op } from 'sequelize'

import { JobPost } from './job-post.model'

interface FilterOptions {
  recruiterId?: number
  title?: string
  location?: string
  type?: string
  minSalary?: number
  maxSalary?: number
  sortBy?: 'createdAt' | 'salary'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export class JobPostRepository {
  static async create(data: Partial<JobPost>) {
    return await JobPost.create(data)
  }

  static async findAll(filters: FilterOptions) {
    const {
      recruiterId,
      title,
      location,
      type,
      minSalary,
      maxSalary,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      limit = 10,
      offset = 1,
    } = filters

    const whereClause: any = {}
    if (recruiterId) whereClause.recruiterId = recruiterId
    if (title) whereClause.title = { [Op.iLike]: `%${title}%` }
    if (location) whereClause.location = { [Op.iLike]: `%${location}%` }
    if (type) whereClause.type = type
    if (minSalary || maxSalary) {
      whereClause.salary = {}
      if (minSalary) whereClause.salary[Op.gte] = minSalary
      if (maxSalary) whereClause.salary[Op.lte] = maxSalary
    }

    return await JobPost.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      include: ['recruiter'],
    })
  }

  static async findById(id: number) {
    return await JobPost.findByPk(id, { include: ['recruiter'] })
  }

  static async update(id: number, data: Partial<JobPost>) {
    const post = await JobPost.findByPk(id)
    if (!post) return null
    return await post.update(data)
  }

  static async delete(id: number) {
    const post = await JobPost.findByPk(id)
    if (!post) return null
    await post.destroy()
    return post
  }
}
