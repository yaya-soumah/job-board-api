import { Router } from 'express'

import { authorizeRole } from '../../middleware/requireRole.middleware'
import { validate } from '../../middleware/validate.middleware'
import { JobPostSchema } from '../job-post/job.schema'

import { JobPostController } from './job-post.controller'

const router = Router()

router.use(authorizeRole('recruiter'))

router.get('/', JobPostController.listJobs)
router.get('/:id', JobPostController.getOne)
router.post('/', validate(JobPostSchema), JobPostController.create)
router.patch('/:id', JobPostController.update)
router.delete('/:id', JobPostController.delete)

export default router
