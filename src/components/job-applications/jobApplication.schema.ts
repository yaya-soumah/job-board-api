import { z } from 'zod'

export const applyJobSchema = z.object({
  coverLetter: z.string().nullable(),
})
