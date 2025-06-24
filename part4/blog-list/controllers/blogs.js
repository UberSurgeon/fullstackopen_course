import express from 'express'
import Blog from '../models/blog.js'
import User from '../models/user.js'
import config from '../utils/config.js'
import jwt from 'jsonwebtoken'
import middleware from '../utils/middleware.js'


const blogsRouter = express.Router()

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('users', { username: 1, name: 1 })
    response.status(200).json(blogs)
})

blogsRouter.post('/',middleware.userExtractor , async (request, response) => {
    const body = request.body

    const user = request.user

    if (!user) {
        return response.status(400).json({ error: 'UserId missing or not valid' })
    }
    console.log(user.name)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        users: user._id
    })

    if (!blog.title || !blog.url){
        return response.status(400).end()
    }

    const savedBlog = await blog.save()
    user.blogs = await user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
    const user = request.user
    if (!user) {
        return response.status(400).json({ error: 'UserId missing or not valid' })
    }
    if (user.blogs.some(blog => blog.toString() === request.params.id)){
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
        console.log("suceed")
    }
})

blogsRouter.put('/:id', async(request, response, next) => {
    const likes = request.body.likes
    const blog = await Blog.findById(request.params.id)
    console.log(request.params.id)
    if (!likes) {
        return response.status(404).end()
    }
    blog.likes = likes

    const savedBlog = await blog.save()
    response.status(200).json(savedBlog)
})


export default blogsRouter
