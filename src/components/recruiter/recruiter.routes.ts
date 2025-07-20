// src/components/recruiter/recruiter.routes.ts
import { Router } from 'express'

import { authenticateToken } from '../../middleware/auth.middleware'
import { authorizeRole } from '../../middleware/requireRole.middleware'

import { RecruiterController } from './recruiter.controller'

const router = Router()

router.use(authenticateToken)

router.get('/all', authorizeRole('admin'), RecruiterController.getAll)
router.delete('/:id', authorizeRole('admin'), RecruiterController.remove)

router.use(authorizeRole('recruiter'))

router.get('/', RecruiterController.getOne)
router.patch('/', RecruiterController.update)

export default router
