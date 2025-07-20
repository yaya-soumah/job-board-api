import { Router } from 'express'

import { authenticateToken } from '../../middleware/auth.middleware'
import { authorizeRole } from '../../middleware/requireRole.middleware'

import { JobPostController } from './job-post.controller'

const router = Router()

router.use(authenticateToken)

router.get('/', authorizeRole('admin'), JobPostController.listJobs)

router.get('/:id', authorizeRole('recruiter'), JobPostController.getOne)
router.post('/', authorizeRole('recruiter'), JobPostController.create)
router.patch('/:id', authorizeRole('recruiter'), JobPostController.update)
router.delete('/:id', authorizeRole('admin'), JobPostController.delete)

export default router
