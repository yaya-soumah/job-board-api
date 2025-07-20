import request from 'supertest'

import app from '../../app'
import { user } from '../factories/user.factory'

describe('Auth Routes', () => {
  const base = '/api/v1/auth'
  let userData = user()

  // beforeEach(async ()=>{
  //   userData = await newUser()
  // })

  it('should register a new user', async () => {
    const res = await request(app)
      .post(base + '/register')
      .send(userData)

    expect(res.status).toBe(201)
    expect(res.body.data).toHaveProperty('token')
  })

  it('Should register admin user', async () => {
    const res = await request(app)
      .post(base + '/register?role=admin')
      .send(userData)

    expect(res.status).toBe(201)
    expect(res.body.data.user.role).toBe('admin')
  })

  it('should login an existing user', async () => {
    await request(app)
      .post(base + '/register?role=admin')
      .send(userData)
    const res = await request(app)
      .post(base + '/login')
      .send({ email: userData.email, password: userData.password })

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveProperty('token')
  })

  it('should fail login for a non-existing user', async () => {
    await request(app)
      .post(base + '/register?role=admin')
      .send(userData)
    const res = await request(app)
      .post(base + '/login')
      .send({ email: 'unknown@example.com', password: userData.password })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Invalid email')
  })

  it('should fail login for a invalid password', async () => {
    await request(app)
      .post(base + '/register?role=admin')
      .send(userData)
    const res = await request(app)
      .post(base + '/login')
      .send({ email: userData.email, password: 'unknownPassword' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Invalid password')
  })
})
