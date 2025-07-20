import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { notFoundHandler } from './middleware/errorNotFound.middleware'
import errorHandler from './middleware/errorMiddleware'
// routes
import authRouter from './components/auth/auth.route'
import userRouter from './components/user/user.routes'
import recruiterRouter from './components/recruiter/recruiter.routes'
import jobPostRouter from './components/job-post/job-post.routes'
import JobApplication from './components/job-applications/jobApplication.routes'
import swaggerRouter from './docs/swagger.routes'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())

//endpoints
const base_url = '/api/v1'
app.get(base_url, (_, res) => {
  res.send('Job blog is up!')
})
app.use(base_url + '/auth', authRouter)
app.use(base_url + '/users', userRouter)
app.use(base_url + '/recruiters', recruiterRouter)
app.use(base_url + '/job-posts', jobPostRouter)
app.use(base_url + '/applications', JobApplication)
app.use(base_url + '/docs', swaggerRouter)

//Not found handler
app.use(notFoundHandler)

// Error handling
app.use(errorHandler)

export default app
