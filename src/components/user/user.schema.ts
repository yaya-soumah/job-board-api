import { z } from 'zod'

export const updateProfileSchema = z.object({
  bio: z.string(),
})

export const updatePasswordSchema = z.object({
  newPassword: z.string().min(6, 'password must be at least 6 characters'),
  currentPassword: z.string().min(6, 'password must be at least 6 characters'),
})
