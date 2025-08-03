import bcrypt from 'bcrypt'

import { UserRepository } from '../user/user.repository'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt.util'
import { AppError } from '../../utils/app-error.util'
import { RecruiterRepository } from '../recruiter/recruiter.repository'

export class AuthService {
  static async registerUser(data: {
    username: string
    email: string
    password: string
    role: string
  }) {
    const isEmailExists = await UserRepository.findUserByEmail(data.email)
    if (isEmailExists) throw new AppError('Email already in use', 400)

    const isUsernameExists = await UserRepository.findUserByUsername(data.username)
    if (isUsernameExists) throw new AppError('Username already in use', 400)

    const hashedPassword = await bcrypt.hash(data.password, 10)
    const user = await UserRepository.createUser({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    })

    let payload: any = { id: user.id, role: user.role }
    if (data.role && data.role === 'recruiter') {
      let recruiterProfile = await RecruiterRepository.findRecruiter(user.id)
      if (!recruiterProfile)
        recruiterProfile = await RecruiterRepository.create({ userId: user.id })

      payload = { id: user.id, role: user.role, recruiterProfileId: recruiterProfile.id }
    }
    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user.toJSON()

    return { accessToken, refreshToken, user: safeUser }
  }

  static async loginUser(email: string, login_password: string) {
    const user = await UserRepository.findUserByEmail(email)
    if (!user) throw new AppError('Invalid email', 400)

    const match = await bcrypt.compare(login_password, user.password)
    if (!match) throw new AppError('Invalid password', 400)

    let payload: any = { id: user.id, role: user.role }
    if (user.role === 'recruiter') {
      const recruiterProfile = await RecruiterRepository.findRecruiter(user.id)
      payload = { id: user.id, role: user.role, recruiterProfileId: recruiterProfile?.id }
    }

    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user.toJSON()

    return { accessToken, refreshToken, user: safeUser }
  }

  static async refresh(refreshToken: string) {
    try {
      const decode = verifyRefreshToken(refreshToken) as {
        id: string
        role: 'user' | 'recruiter' | 'admin'
        recruiterProfileId?: number
      }
      const newToken = signAccessToken({
        id: decode.id,
        role: decode.role,
        recruiterProfileId: decode.recruiterProfileId,
      })
      return { newToken }
    } catch {
      throw new AppError('Invalid refresh token', 400)
    }
  }
}
