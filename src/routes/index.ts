import Router from 'express'

import { authenticateToken } from '../middleware/auth.middleware'
import authRouter from '../components/auth/auth.route'
import jobApplicationRouter from '../components/job-applications/jobApplication.routes'
import jobPostRouter from '../components/job-post/job-post.routes'
import recruiterRouter from '../components/recruiter/recruiter.routes'
import userRouter from '../components/user/user.routes'

const router = Router()

router.use('/auth', authRouter)

router.use(authenticateToken)
router.use('/job-posts', jobPostRouter)
router.use('/recruiters', recruiterRouter)
router.use('/users', userRouter)
router.use('/job-applications', jobApplicationRouter)

export default router
