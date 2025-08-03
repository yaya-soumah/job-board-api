import { z } from 'zod'

export const registerSchema = z.object({
  username: z.string().min(2, 'username must be at least 2 characters'),
  password: z.string().min(6, 'password must be at least 6 characters'),
  email: z.string().email(),
})

export const loginSchema = z.object({
  password: z.string().min(6, 'password must be at least 6 characters'),
  email: z.string().email(),
})
