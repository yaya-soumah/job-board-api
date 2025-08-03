export const userFactory = (override?: any) => {
  return {
    username: 'user',
    email: 'user@example.com',
    password: 'password123',
    ...override,
  }
}
