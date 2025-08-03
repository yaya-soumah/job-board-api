import { UserRepository } from '../user/user.repository'
import { JobPostRepository } from '../job-post/job-post.repository'
import { AppError } from '../../utils/app-error.util'
import { ApplicationStatus } from '../models/index'

import { JobApplicationRepository } from './jobApplication.repository'

export class JobApplicationService {
  static async applyToJob(userId: number, jobId: number, coverLetter: string) {
    const user = await UserRepository.findUserById(userId)
    if (!user) throw new AppError('Invalid userId', 404)

    const jobPost = await JobPostRepository.findById(jobId)
    if (!jobPost) throw new AppError('Invalid jobId', 404)
    return JobApplicationRepository.createApplication({ userId, jobId, coverLetter })
  }

  static async getMyApplications(userId: number) {
    return JobApplicationRepository.findUserApplications(userId)
  }

  static async getApplicationsForRecruiter(recruiterId: number) {
    return JobApplicationRepository.findApplicationByRecruiter(recruiterId)
  }

  static async getAllApplicationsForAdmin() {
    return JobApplicationRepository.findAllApplications()
  }

  static async updateApplicationStatus(
    recruiterId: number,
    applicationId: number,
    status: ApplicationStatus,
  ) {
    const application = await JobApplicationRepository.findApplicationById(applicationId)

    if (!application) throw new AppError('Application not found', 400)

    if (application.job.recruiterId !== recruiterId)
      throw new AppError('Forbidden: You can only update applications for your own jobs', 403)
    application.update({ status })

    return application
  }

  static async removeApplication(applicationId: number, userId: number) {
    const jobApplication = await JobApplicationRepository.findApplicationById(applicationId)
    if (!jobApplication) throw new AppError('Application not found', 404)
    if (jobApplication.userId !== userId)
      throw new AppError('Insufficient privilege:You cannot delete this application', 403)
    await JobApplicationRepository.removeApplication(applicationId)

    return true
  }
}
