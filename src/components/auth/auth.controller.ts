import { Request, Response } from 'express'

import { error, success } from '../../utils/response.util'
import { AppError } from '../../utils/app-error.util'

import { AuthService } from './auth.service'

export async function register(req: Request, res: Response) {
  try {
    const role = (req.query.role as string) || 'user' //default to 'user' role
    const data = req.body
    const { user, accessToken, refreshToken } = await AuthService.registerUser({ ...data, role })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    success(res, 201, { token: accessToken, user }, 'User created successfully')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}

export async function login(req: Request, res: Response) {
  try {
    const data = req.body
    const { user, accessToken, refreshToken } = await AuthService.loginUser(
      data.email,
      data.password,
    )

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    success(res, 200, { token: accessToken, user }, 'login successful')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const token = req.cookies.refreshToken
    if (!token) throw new AppError('Refresh token is required', 401)
    const { newToken } = await AuthService.refresh(token)

    success(res, 200, { token: newToken }, 'Token refreshed successfully')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}
