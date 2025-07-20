export const user = (overrides = {}) => {
  return {
    name: 'user',
    email: 'user@example.com',
    password: 'password123',
    ...overrides,
  }
}

export const userList = (count: number, overrides = {}) => {
  return Array.from({ length: count }, () => user(overrides))
}
