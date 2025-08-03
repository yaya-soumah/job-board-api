// src/components/recruiter/recruiter.repository.ts
import { RecruiterProfile } from './recruiter.model'

export class RecruiterRepository {
  static async findRecruiter(id: number) {
    return await RecruiterProfile.findOne({ where: { userId: id } })
  }

  static async create(data: Partial<RecruiterProfile>) {
    return await RecruiterProfile.create(data)
  }

  static async findById(id: number) {
    return await RecruiterProfile.findByPk(id)
  }

  static async findAll() {
    return await RecruiterProfile.findAll()
  }

  static async update(id: number, data: Partial<RecruiterProfile>) {
    const profile = await RecruiterProfile.findByPk(id)
    if (!profile) return null
    return await profile.update(data)
  }

  static async delete(id: number) {
    const profile = await RecruiterProfile.findByPk(id)
    if (!profile) return null
    await profile.destroy()
    return profile
  }
}
