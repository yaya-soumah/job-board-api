import { Response, Request } from 'express'

import { error, success } from '../../utils/response.util'
import { getPagination } from '../../utils/pagination.util'
import { AppError } from '../../utils/app-error.util'

import { UserService } from './user.service'

export const getProfile = async (req: Request, res: Response) => {
  try {
    const id = (req as any).user.id
    const user = await UserService.getUserById(id)
    success(res, 200, user, 'Operation successful')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page, limit, offset, filters } = await getPagination(req.query)
    const data = await UserService.getAllUsers(page, limit, offset, filters)
    success(res, 200, data, 'Operation successful')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const id = (req as any).user.id
    const user = await UserService.updateProfile(id, req.body)

    success(res, 200, user, 'User updated')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    await UserService.deleteUser(id)
    success(res, 204, {}, 'User deleted')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const id = (req as any).user.id
    const { currentPassword, newPassword } = req.body
    await UserService.updatePassword(id, currentPassword, newPassword)
    success(res, 200, {}, 'Password updated')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}

export const updateAvatar = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const file = req.file

    if (!file) throw new AppError('No file uploaded', 400)

    const updatedUser = await UserService.updateAvatar(userId, file.filename)
    success(res, 200, updatedUser, 'Avatar updated successfully')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}
