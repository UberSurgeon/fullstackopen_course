import {test, after, beforeEach} from 'node:test'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app.js'
import assert from 'node:assert'
import Blog from '../models/blog.js'
import helper from './test_helper.js'

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initalBlogs)
})

test('testing get blog', async() => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('test is _id => id', async() => {
    const resultBlog = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert(resultBlog._body.some(blog => blog.hasOwnProperty('id')))
})

test('a blog can be added', async() => {
    const newBlog = 
        {
            _id: 'a2b7c9e184f23d56a9c4f712',
            title: 'sibuxianfg',
            author: 'andioadj',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const checkblogs = await helper.blogsInDb()
    assert.strictEqual(checkblogs.length, helper.initalBlogs.length +1)

    const contents = checkblogs.map(r => r.title)
    assert(contents.includes('sibuxianfg'))
})

test('missing like', async () => {
    const newBlog = 
    {
        _id: 'c7f9b3e2a1854c7f9d6a1b30',
        title: 'tuye',
        author: 'andioadj',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        __v: 0
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const checkblogs = await helper.blogsInDb()
    assert.strictEqual(checkblogs.length, helper.initalBlogs.length +1)

    const contents = checkblogs.map(r => r.likes)
    assert(contents.includes(0))
})

test('missing title and url', async () => {
    const newBlog = 
    {
        _id: 'e4a7d6c91f8b3e54a2d9f0cb',
        author: 'andioadj',
        __v: 0
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initalBlogs.length)
})

test('delete', async () => {
    const lestart = await helper.blogsInDb()
    const ledelete = lestart[0] 

    await api
        .delete(`/api/blogs/${ledelete.id}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initalBlogs.length -1)
})

test('update', async () => {
    const lestart = await helper.blogsInDb()
    const leedit = lestart[0] 

    leedit.likes = 250

    await api
        .put(`/api/blogs/${leedit.id}`)
        .send(leedit)
        .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initalBlogs.length)

    const contents = blogsAtEnd.map(content => content.id == leedit.id ? content.likes : 0)
    assert(contents.includes(250))
})

after( async() => {
    await mongoose.connection.close()
})
