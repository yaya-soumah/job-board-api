// src/components/recruiter/recruiter.controller.ts
import { Request, Response } from 'express'

import { error, success } from '../../utils/response.util'
import { AppError } from '../../utils/app-error.util'

import { RecruiterService } from './recruiter.service'

export class RecruiterController {
  static async create(req: Request, res: Response) {
    try {
      const id = (req as any).user.id
      const profile = await RecruiterService.createProfile({ ...req.body, userId: id })
      success(res, 201, profile)
    } catch (err) {
      error(res, (err as AppError).statusCode, (err as AppError).message)
    }
  }

  static async getOne(req: Request, res: Response) {
    try {
      const id = (req as any).user.recruiterProfileId
      const profile = await RecruiterService.getProfile(id)
      if (!profile) throw new AppError('Profile not found', 404)
      success(res, 200, profile)
    } catch (err) {
      error(res, (err as AppError).statusCode, (err as AppError).message)
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const profiles = await RecruiterService.listProfiles()
      success(res, 201, profiles)
    } catch (err) {
      error(res, (err as AppError).statusCode, (err as AppError).message)
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = (req as any).user.recruiterProfileId
      const profile = await RecruiterService.updateProfile(id, req.body)
      if (!profile) throw new AppError('Profile not found', 404)
      success(res, 200, profile)
    } catch (err) {
      error(res, (err as AppError).statusCode, (err as AppError).message)
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      const profile = await RecruiterService.deleteProfile(Number(req.params.id))
      if (!profile) throw new AppError('Profile not found', 404)
      success(res, 204, {})
    } catch (err) {
      error(res, (err as AppError).statusCode, (err as AppError).message)
    }
  }
}
