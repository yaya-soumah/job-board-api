import { Router } from 'express'

import { validate } from '../../middleware/validate.middleware'

import { register, login, refreshToken } from './auth.controller'
import { registerSchema, loginSchema } from './auth.schema'

const router = Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/refresh', refreshToken)

export default router
