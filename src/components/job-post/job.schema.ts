import { z } from 'zod'

export const JobPostSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string(),
  type: z.enum(['full-time', 'part-time', 'contract']),
  recruiterId: z.number().optional(),
  salary: z.number().optional(),
})
