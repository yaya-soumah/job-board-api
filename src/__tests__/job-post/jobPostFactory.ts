export const jobPostFactory = (override?: any) => {
  return {
    title: 'my post',
    description: 'Backend',
    location: 'anywhere',
    type: 'full-time',
    ...override,
  }
}
