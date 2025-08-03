import { Request, Response } from 'express'

import { error, success } from '../../utils/response.util'
import { ApplicationStatus } from '../models/index'
import { AppError } from '../../utils/app-error.util'

import { JobApplicationService } from './jobApplication.service'

export const apply = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const { coverLetter } = req.body
    const jobId = parseInt(req.params.jobId)

    const application = await JobApplicationService.applyToJob(userId, jobId, coverLetter)

    success(res, 201, application, 'Application successfull')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}

export const getMyApplications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const applications = await JobApplicationService.getMyApplications(userId)
    success(res, 200, applications, 'Application list retrieved successfully')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}

export const getRecruiterApplications = async (req: Request, res: Response) => {
  try {
    const recruiterId = (req as any).user.id
    const applications = await JobApplicationService.getApplicationsForRecruiter(recruiterId)
    success(res, 200, applications, 'Applications retrieved successfully')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}

export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const applications = await JobApplicationService.getAllApplicationsForAdmin()
    success(res, 200, applications, 'Applications retrieved successfully')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const applicationId = parseInt(req.params.applicationId)
    const { status } = req.body
    const recruiterId = (req as any).user.recruiterProfileId

    if (![ApplicationStatus.SHORTLISTED, ApplicationStatus.REJECTED].includes(status)) {
      throw new AppError('Invalid status value', 400)
    }

    const updatedApplication = await JobApplicationService.updateApplicationStatus(
      recruiterId,
      applicationId,
      status,
    )

    success(res, 200, updatedApplication, 'Status updated successfully')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}

export const removeApplication = async (req: Request, res: Response) => {
  try {
    const applicationId = parseInt(req.params.applicationId)
    const userId = (req as any).user.id
    await JobApplicationService.removeApplication(applicationId, userId)
    success(res, 204, {}, 'Application removed')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}
