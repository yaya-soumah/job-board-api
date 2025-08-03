import { Router } from 'express'

import { upload } from '../../middleware/uploads.middleware'
import { validate } from '../../middleware/validate.middleware'
import { authorizeRole } from '../../middleware/requireRole.middleware'

import {
  getAllUsers,
  updateProfile,
  getProfile,
  deleteProfile,
  updatePassword,
  updateAvatar,
} from './user.controller'
import { updatePasswordSchema, updateProfileSchema } from './user.schema'

const router = Router()

router.get('/', authorizeRole('admin'), getAllUsers)
router.get('/me', getProfile)
router.patch('/me', validate(updateProfileSchema), updateProfile)
router.delete('/:id', authorizeRole('admin'), deleteProfile)
router.patch('/me/password', validate(updatePasswordSchema), updatePassword)
router.patch('/me/avatar', upload.single('avatar'), updateAvatar)

export default router
