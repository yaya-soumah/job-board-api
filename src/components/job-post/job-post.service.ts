// src/components/job-post/job-post.service.ts
import { JobPostRepository } from './job-post.repository'

export class JobPostService {
  static async create(data: any) {
    return await JobPostRepository.create(data)
  }

  static async listPublicJobs(filters?: any) {
    const { limit, page, ...filteroptions } = filters
    const offset = (page - 1) * limit
    filteroptions.offset = offset
    const { count, rows } = await JobPostRepository.findAll(filteroptions)
    return {
      jobs: rows,
      total: count,
      page,
      limit,
      totalPage: Math.ceil(count / limit),
    }
  }

  static async getOne(id: number) {
    return await JobPostRepository.findById(id)
  }

  static async update(id: number, data: any) {
    return await JobPostRepository.update(id, data)
  }

  static async remove(id: number) {
    return await JobPostRepository.delete(id)
  }
}
