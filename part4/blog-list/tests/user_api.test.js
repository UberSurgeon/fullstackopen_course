import { test, after, beforeEach} from 'node:test'
import assert from 'node:assert'
import app from '../app.js'
import helper from './test_helper.js'
import User from '../models/user.js'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import supertest from 'supertest'

const api = supertest(app)
beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initalUser)
})


test('testing get user', async() => {
    await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const end = await helper.usersInDb()

    assert.strictEqual(end.length, helper.initalUser.length)
})

test('invalid add', async() => {
    const start = await helper.usersInDb()
    const user = {
        username: "fwsdf",
        name: "tuye rabbit",
        password: "li"
    }

    await api
        .post('/api/users')
        .send(user)
        .expect(400)
    const end = await helper.usersInDb()

    assert.strictEqual(end.length, start.length)


})

after( async() => {
    await mongoose.connection.close()
})

