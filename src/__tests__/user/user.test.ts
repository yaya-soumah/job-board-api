import request from 'supertest'

import app from '../../app'

import { userFactory } from './user.factory'

describe('User API', () => {
  const userData = userFactory()
  const adminData = userFactory({ username: 'admin', email: 'admin@example.com', role: 'admin' })
  let userToken = ''
  let adminToken = ''

  beforeAll(async () => {
    const res1 = await request(app).post('/api/v1/auth/register').send(userData)
    userToken = res1.body.data.token

    const res2 = await request(app).post('/api/v1/auth/register?role=admin').send(adminData)
    adminToken = res2.body.data.token
  })

  describe('POST /users', () => {
    it('Should allow admin to get all users', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(res.status).toBe(200)
      expect(res.body.data.length).toBeGreaterThan(0)
    })

    it('Should deny access to non-admin and return 403', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)

      expect(res.status).toBe(403)
    })
  })

  describe('GET /users/me', () => {
    it('Should get user me', async () => {
      const res = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${userToken}`)

      expect(res.status).toBe(200)
    })
    it('Should update user', async () => {
      const res = await request(app)
        .patch('/api/v1/users/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ bio: 'Backend Developer' })

      expect(res.status).toBe(200)
    })
  })

  describe('PATCH /users/me/password', () => {
    it('Should update password', async () => {
      const res = await request(app)
        .patch('/api/v1/users/me/password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ currentPassword: 'password123', newPassword: 'newPassword123' })

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('Password updated')
    })
  })

  describe('DELETE /users/:id', () => {
    it('Should allow admin to remove user', async () => {
      const res = await request(app)
        .delete('/api/v1/users/1')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(res.status).toBe(204)
    })
    it('Should not allow non-admin to remove user', async () => {
      const res = await request(app)
        .delete('/api/v1/users/1')
        .set('Authorization', `Bearer ${userToken}`)

      expect(res.status).toBe(403)
    })
  })
})
