import { RecruiterRepository } from './recruiter.repository'

export class RecruiterService {
  static async createProfile(data: any) {
    return await RecruiterRepository.create(data)
  }

  static async getProfile(id: number) {
    return await RecruiterRepository.findById(id)
  }

  static async listProfiles() {
    return await RecruiterRepository.findAll()
  }

  static async updateProfile(id: number, data: any) {
    return await RecruiterRepository.update(id, data)
  }

  static async deleteProfile(id: number) {
    return await RecruiterRepository.delete(id)
  }
}
