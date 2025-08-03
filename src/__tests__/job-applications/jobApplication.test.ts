import request from 'supertest'

import { userFactory } from '../user/user.factory'
import { jobPostFactory } from '../job-post/jobPostFactory'
import app from '../../app'

import { jobApplicationFactory } from './jobApplication.factory'

describe('Job Application API', () => {
  let jobApplicationData = jobApplicationFactory()
  const userData = userFactory({
    username: 'user',
    email: 'user@example.com',
    password: 'password123',
  })
  const recruiterData = userFactory({
    username: 'recruiter',
    email: 'recruiter@example.com',
    password: 'password123',
  })
  let userToken = ''
  let recruiterToken = ''

  const jobPostData = jobPostFactory()
  let jobId: number

  beforeAll(async () => {
    const res_user = await request(app).post('/api/v1/auth/register').send(userData)

    userToken = res_user.body.data.token

    const res_recruiter = await request(app)
      .post('/api/v1/auth/register?role=recruiter')
      .send(recruiterData)

    recruiterToken = res_recruiter.body.data.token

    const res_job_post = await request(app)
      .post('/api/v1/job-posts')
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send(jobPostData)

    jobId = Number(res_job_post.body.data.id)
  })

  describe('POST /job-applications', () => {
    it('Should create a job application', async () => {
      const res = await request(app)
        .post(`/api/v1/job-applications/${jobId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(jobApplicationData)

      expect(res.status).toBe(201)
    })
    it('Should throw error for invalid jobId', async () => {
      const res = await request(app)
        .post(`/api/v1/job-applications/${100}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(jobApplicationData)

      expect(res.status).toBe(404)
    })
    it('Should throw error for missing data', async () => {
      const res = await request(app)
        .post(`/api/v1/job-applications/${jobId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send()

      expect(res.status).toBe(400)
    })
  })
  describe('get,update, delete', () => {
    let applicationId: number
    beforeAll(async () => {
      const res_application = await request(app)
        .post(`/api/v1/job-applications/${jobId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(jobApplicationData)

      applicationId = Number(res_application.body.data.id)
    })

    describe('GET /', () => {
      it('Should get a job application', async () => {
        const res = await request(app)
          .get('/api/v1/job-applications')
          .set('Authorization', `Bearer ${userToken}`)

        expect(res.status).toBe(200)
      })
      it('Should throw error for missing token', async () => {
        const res = await request(app).get('/api/v1/job-applications')

        expect(res.status).toBe(401)
      })
    })
    describe('GET /recruiter', () => {
      it('Should get list of all job applications of a recruiter', async () => {
        const res = await request(app)
          .get('/api/v1/job-applications/recruiter')
          .set('Authorization', `Bearer ${recruiterToken}`)

        expect(res.status).toBe(200)
      })
      it('Should not allow a simple user to see list of all job applications', async () => {
        const res = await request(app)
          .get('/api/v1/job-applications/recruiter')
          .set('Authorization', `Bearer ${userToken}`)

        expect(res.status).toBe(403)
      })
      it('Should throw error for missing token', async () => {
        const res = await request(app).get('/api/v1/job-applications/recruiter')

        expect(res.status).toBe(401)
      })
    })
    describe('GET /admin', () => {
      let adminToken = ''
      beforeAll(async () => {
        const res_user = await request(app)
          .post('/api/v1/auth/register?role=admin')
          .send({ username: 'admin', password: 'password123', email: 'admin@example.com' })
        adminToken = res_user.body.data.token
      })
      it('Should only admin to get list of all job applications', async () => {
        const res = await request(app)
          .get('/api/v1/job-applications/admin')
          .set('Authorization', `Bearer ${adminToken}`)

        expect(res.status).toBe(200)
      })
      it('Should not allow a non-admin to get list of all job applications', async () => {
        const res = await request(app)
          .get('/api/v1/job-applications/admin')
          .set('Authorization', `Bearer ${userToken}`)

        expect(res.status).toBe(403)
      })
      it('Should throw error for missing token', async () => {
        const res = await request(app).get('/api/v1/job-applications/recruiter')

        expect(res.status).toBe(401)
      })
    })

    describe('PATCH /:applicationId/status', () => {
      it('Should update the status of an application', async () => {
        const res = await request(app)
          .patch(`/api/v1/job-applications/${applicationId}/status`)
          .set('Authorization', `Bearer ${recruiterToken}`)
          .send({ status: 'shortlisted' })

        expect(res.status).toBe(200)
      })
      it('Should throw error for invalid value of status', async () => {
        const res = await request(app)
          .patch(`/api/v1/job-applications/${applicationId}/status`)
          .set('Authorization', `Bearer ${recruiterToken}`)
          .send({ status: 'invalid' })

        expect(res.status).toBe(400)
      })
      it('Should throw error for non-recruiter', async () => {
        const res = await request(app)
          .patch(`/api/v1/job-applications/${applicationId}/status`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ status: 'shortlisted' })

        expect(res.status).toBe(403)
      })
      it('Should throw error for non-owner of job post', async () => {
        const res_recruiter = await request(app).post('/api/v1/auth/register?role=recruiter').send({
          email: 'recruiter2@example.com',
          username: 'recruiter2',
          password: 'password123',
        })

        recruiterToken = res_recruiter.body.data.token
        const res = await request(app)
          .patch(`/api/v1/job-applications/${applicationId}/status`)
          .set('Authorization', `Bearer ${recruiterToken}`)
          .send({ status: 'shortlisted' })

        expect(res.status).toBe(403)
      })
      it('Should throw error for invalid applicationId', async () => {
        const res = await request(app)
          .patch(`/api/v1/job-applications/${50}/status`)
          .set('Authorization', `Bearer ${recruiterToken}`)
          .send({ status: 'shortlisted' })

        expect(res.status).toBe(400)
      })
      it('Should not allow a simple user to update a status', async () => {
        const res = await request(app)
          .patch(`/api/v1/job-applications/${applicationId}/status`)
          .set('Authorization', `Bearer ${userToken}`)

        expect(res.status).toBe(403)
      })
      it('Should throw error for missing token', async () => {
        const res = await request(app).patch(`/api/v1/job-applications/${applicationId}/status`)

        expect(res.status).toBe(401)
      })
    })

    describe('DELETE /delete/:applicationId', () => {
      it('Should delete job application', async () => {
        const res = await request(app)
          .delete(`/api/v1/job-applications/${1}`)
          .set('Authorization', `Bearer ${userToken}`)
        console.log('delete', res.body)
        expect(res.status).toBe(204)
      })
      it('Should throw error for invalid applicationId', async () => {
        const res = await request(app)
          .delete(`/api/v1/job-applications/${10}`)
          .set('Authorization', `Bearer ${userToken}`)
        console.log('delete', res.body)
        expect(res.status).toBe(404)
      })
      it('Should throw error for non-owner of the application', async () => {
        const res = await request(app)
          .delete(`/api/v1/job-applications/${1}`)
          .set('Authorization', `Bearer ${recruiterToken}`)
        console.log('delete', res.body)
        expect(res.status).toBe(403)
      })
    })
  })
})
