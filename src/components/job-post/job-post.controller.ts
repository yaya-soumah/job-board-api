// src/components/job-post/job-post.controller.ts
import { Request, Response } from 'express'

import { error, success } from '../../utils/response.util'
import { AppError } from '../../utils/app-error.util'

import { JobPostService } from './job-post.service'

export class JobPostController {
  static async create(req: Request, res: Response) {
    try {
      const recruiterId = (req as any).user.recruiterProfileId
      const job = await JobPostService.create({
        ...req.body,
        recruiterId,
      })
      success(res, 201, job, 'job created successfully')
    } catch (err) {
      error(res, (err as AppError).statusCode, (err as AppError).message)
    }
  }

  static async listJobs(req: Request, res: Response) {
    try {
      const filters = {
        recruiterId: (req as any).user.recruiterProfileId,
        title: req.query.title as string,
        location: req.query.location as string,
        type: req.query.jobType as string,
        minSalary: req.query.minSalary ? Number(req.query.minSalary) : undefined,
        maxSalary: req.query.maxSalary ? Number(req.query.maxSalary) : undefined,
        sortBy: req.query.sortBy as 'createdAt' | 'salary',
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
        limit: req.query.limit ? Number(req.query.limit) : 10,
        page: req.query.page ? Number(req.query.page) : 1,
      }

      const jobs = await JobPostService.listPublicJobs(filters)
      // const jobs = await JobPostService.getAll(id);
      success(res, 200, jobs, 'jobs list retrieved successfully')
    } catch (err) {
      error(res, (err as AppError).statusCode, (err as AppError).message)
    }
  }

  static async getOne(req: Request, res: Response) {
    try {
      const job = await JobPostService.getOne(Number(req.params.id))
      if (!job) throw new AppError('Not found', 404)
      success(res, 200, job, 'job retrieved successfully')
    } catch (err) {
      error(res, (err as AppError).statusCode, (err as AppError).message)
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const job = await JobPostService.update(Number(req.params.id), req.body)
      if (!job) throw new AppError('Not found', 404)
      success(res, 200, job, 'job updated successfully')
    } catch (err) {
      error(res, (err as AppError).statusCode, (err as AppError).message)
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const job = await JobPostService.remove(Number(req.params.id))
      if (!job) throw new AppError('Not found', 404)
      success(res, 204, job, 'job deleted successfully')
    } catch (err) {
      error(res, (err as AppError).statusCode, (err as AppError).message)
    }
  }
}
