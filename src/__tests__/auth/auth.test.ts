import request from 'supertest'

import app from '../../app'
import { getToken } from '../utils'

import { userFactory } from './auth.factory'

describe('auth API', () => {
  let userData = userFactory()

  describe('POST /auth/register', () => {
    it('should create a new user', async () => {
      const res = await request(app).post('/api/v1/auth/register').send(userData)

      expect(res.status).toBe(201)
      expect(res.body.data).toHaveProperty('token')
    })

    it('Should create an admin role user', async () => {
      let adminData = userFactory({ username: 'admin', email: 'admin@example.com' })
      const res = await request(app).post('/api/v1/auth/register?role=admin').send(adminData)
      expect(res.status).toBe(201)
      expect(res.body.data.user.role).toBe('admin')
    })

    it('Should throw error for missing credential', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'user@example.com', password: 'password123' })

      expect(res.status).toBe(400)
      expect(res.body.message).toBe('Validation failed')
    })
  })

  describe('POST /auth/login', () => {
    it('should login an existing user', async () => {
      await request(app).post('/api/v1/auth/register').send(userData)
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: userData.email, password: userData.password })

      expect(res.status).toBe(200)
      expect(res.body.data).toHaveProperty('token')
    })

    it('should throw error for a non-existing user', async () => {
      await request(app).post('/api/v1/auth/register').send(userData)
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'unknown@example', password: userData.password })

      expect(res.status).toBe(400)
      expect(res.body.message).toBe('Validation failed')
    })

    it('should throw error for a invalid password', async () => {
      await request(app).post('/api/v1/auth/register').send(userData)
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'user@example', password: 'invalidPassword' })

      expect(res.status).toBe(400)
      expect(res.body.message).toBe('Validation failed')
    })
  })

  describe('POST /auth/refresh', () => {
    it('Should get new token', async () => {
      const { accessToken, refreshToken } = getToken({ id: 1, role: 'user' })

      const sessionCookie = `refreshToken=${refreshToken}; HttpOnly; Secure=false; SameSite=strict`
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Cookie', [sessionCookie])

      expect(res.status).toBe(200)
      expect(res.body.data).toHaveProperty('token')
    })
  })
})
