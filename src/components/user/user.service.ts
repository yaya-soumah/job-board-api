import path from 'path'
import fs from 'fs'

import bcrypt from 'bcrypt'

import { AppError } from '../../utils/app-error.util'
import logger from '../../config/logger'

import { UserRepository } from './user.repository'

export class UserService {
  static async getUserById(id: number) {
    const user = await UserRepository.findUserById(id)
    if (!user) throw new AppError('User not found', 404)

    return user
  }

  static async getUserByEmail(email: string) {
    const user = await UserRepository.findUserByEmail(email)
    if (!user) throw new AppError('User not found', 404)
    return user
  }

  static async getAllUsers(page: number, limit: number, offset: number, filters: any) {
    const { rows, count } = await UserRepository.findAllUsers(limit, offset, filters)
    return { users: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) }
  }

  static async updateProfile(id: number, data: any) {
    const updated = await UserRepository.updateUserProfile(id, data)
    if (!updated) throw new AppError('User not found', 404)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...response } = updated.get({ plain: true })
    return response
  }

  static async updatePassword(id: number, currentPassword: string, newPassword: string) {
    const user = await UserRepository.findUserByIdForPasswordUpdate(id)
    const match = await bcrypt.compare(currentPassword, user!.password)
    if (!match) throw new AppError('Invalid password', 400)

    const hashed = await bcrypt.hash(newPassword, 10)
    user!.update({ password: hashed })
    return true
  }

  static async updateAvatar(userId: number, filename: string) {
    const user = await UserRepository.findUserById(userId)
    if (!user) throw new AppError('User not found', 404)

    const avatarUrl = `/uploads/${filename}`

    //replace old avatar
    if (user.avatar) {
      const oldPath = path.join(__dirname, '../../..', user.avatar)
      logger.info(`path from req: ${oldPath}`)
      fs.access(oldPath, fs.constants.F_OK, (err) => {
        logger.error(`err reading fils: ${err}`)
        if (!err) {
          fs.unlink(oldPath, (unlinkErr) => {
            if (unlinkErr) logger.error(`Error deleting old avatar: ${unlinkErr}`)
          })
        }
      })
    }

    const updated = await UserRepository.updateUserProfile(userId, { avatar: avatarUrl })
    if (!updated) throw new AppError('User not found', 404)

    return updated
  }

  static async deleteUser(id: number) {
    const user = await UserRepository.findUserById(id)
    if (!user) throw new AppError('User not found', 404)
    user.destroy()
  }
}
