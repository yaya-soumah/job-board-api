import { User } from '../user/user.model'
import { RecruiterProfile } from '../recruiter/recruiter.model'
import { JobPost } from '../job-post/job-post.model'
import { JobApplication, ApplicationStatus } from '../job-applications/jobApplication.model'

export const models = [User, RecruiterProfile, JobPost, JobApplication]

export { User, RecruiterProfile, JobPost, JobApplication, ApplicationStatus }
