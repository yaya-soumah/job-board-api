import request from 'supertest'

import app from '../../app'

describe('Job Post API', () => {
  let token: string

  beforeAll(async () => {
    const res = await request(app).post('/api/v1/auth/register?role=recruiter').send({
      username: 'recruiter',
      email: 'recruiter@example.com',
      password: 'password123',
    })
    token = res.body.data.token
  })

  describe('POST /jop-posts', () => {
    it('Should create a new job post', async () => {
      const post = {
        title: 'my post',
        description: 'Backend',
        location: 'anywhere',
        type: 'full-time',
      }
      const res = await request(app)
        .post('/api/v1/job-posts')
        .set('Authorization', `Bearer ${token}`)
        .send(post)

      expect(res.status).toBe(201)
    })
    it('Should throw error for missing data', async () => {
      const post = {
        title: 'my post',
        location: 'anywhere',
        type: 'full-time',
      }
      const res = await request(app)
        .post('/api/v1/job-posts')
        .set('Authorization', `Bearer ${token}`)
        .send(post)

      expect(res.status).toBe(400)
    })
  })

  describe('GET/PATCH/DELETE', () => {
    beforeAll(async () => {
      const post = {
        title: 'my post',
        description: 'Backend',
        location: 'anywhere',
        type: 'full-time',
      }
      await request(app)
        .post('/api/v1/job-posts')
        .set('Authorization', `Bearer ${token}`)
        .send(post)
    })

    describe('GET /job-posts', () => {
      it('Should get all post', async () => {
        const res = await request(app)
          .get('/api/v1/job-posts')
          .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
      })

      it('Should get one post', async () => {
        const res = await request(app)
          .get('/api/v1/job-posts/1')
          .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
      })
    })

    describe('PATCH /job-posts/{id}', () => {
      it('should update post', async () => {
        const res = await request(app)
          .patch('/api/v1/job-posts/1')
          .set('Authorization', `Bearer ${token}`)
          .send({ location: 'on-site' })

        expect(res.status).toBe(200)
        expect(res.body.data.location).toBe('on-site')
      })
    })
    describe('DELETE /job-posts/{id}', () => {
      it('should delete post', async () => {
        const res = await request(app)
          .delete('/api/v1/job-posts/1')
          .set('Authorization', `Bearer ${token}`)

        console.log('delete', res.body)
        expect(res.status).toBe(204)
      })
    })
  })
})
