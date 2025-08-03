import { Router } from 'express'

import { authorizeRole } from '../../middleware/requireRole.middleware'
import { validate } from '../../middleware/validate.middleware'

import { applyJobSchema } from './jobApplication.schema'
import {
  apply,
  getMyApplications,
  getRecruiterApplications,
  getAllApplications,
  updateApplicationStatus,
  removeApplication,
} from './jobApplication.controller'

const router = Router()

router.post('/:jobId', authorizeRole('user'), validate(applyJobSchema), apply)
router.get('/', authorizeRole('user'), getMyApplications)
router.get('/recruiter', authorizeRole('recruiter'), getRecruiterApplications)
router.get('/admin', authorizeRole('admin'), getAllApplications)
router.patch('/:applicationId/status', authorizeRole('recruiter'), updateApplicationStatus)
router.delete('/:applicationId', authorizeRole('user'), removeApplication)

export default router
