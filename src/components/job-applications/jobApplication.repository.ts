import { JobApplication, JobPost, User, RecruiterProfile } from '../models/index'

export class JobApplicationRepository {
  static async createApplication(data: { userId: number; jobId: number; coverLetter: string }) {
    return JobApplication.create(data)
  }

  static async findApplicationById(applicationId: number) {
    return JobApplication.findByPk(applicationId, { include: ['job'] })
  }

  static async findUserApplications(userId: number) {
    return JobApplication.findAll({
      where: { userId },
      include: [
        {
          model: JobPost,
          as: 'job',
          attributes: ['id', 'title'],
          include: [
            {
              model: RecruiterProfile,
              as: 'recruiter',
              include: [{ model: User, attributes: ['id', 'username', 'email'] }],
            },
          ],
        },
      ],
      attributes: ['id', 'status', 'createdAt'],
      order: [['createdAt', 'DESC']],
    })
  }

  static async findApplicationByRecruiter(recruiterId: number) {
    return JobApplication.findAll({
      include: [
        {
          model: JobPost,
          where: { recruiterId },
          attributes: ['id', 'title'],
        },
        {
          model: User,
          attributes: ['id', 'email', 'username'],
        },
      ],
      order: [['createdAt', 'DESC']],
    })
  }

  static async findAllApplications() {
    return JobApplication.findAll({
      include: [
        {
          model: JobPost,
          attributes: ['id', 'title', 'recruiterId'],
        },
        {
          model: User,
          attributes: ['id', 'username', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    })
  }
  static async removeApplication(id: number) {
    return JobApplication.destroy({ where: { id } })
  }
}
