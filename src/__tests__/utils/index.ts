import { signAccessToken, signRefreshToken } from '../../utils/jwt.util'

export function getToken(user: any) {
  const payload = { id: user.id, role: user.role }
  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

  return { user, accessToken, refreshToken }
}
