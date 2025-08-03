export const jobApplicationFactory = (override?: any) => {
  return { coverLetter: 'my coverLetter', ...override }
}
