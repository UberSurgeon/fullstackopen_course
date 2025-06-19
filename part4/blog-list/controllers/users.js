import User from "../models/user.js"
import bcrypt from 'bcrypt'
import express, { request, response } from 'express'

const usersRouter = express.Router()

usersRouter.get('/', async (request, response) => {
    const user = await User.find({}).populate('blogs', {
        title: 1,
        author: 1,
        url: 1,
        likes: 1,
    })
    response.status(200).json(user)
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body
    console.log(request.body)
    if (password.length < 4){
        return response.status(400).json({ error: "Password need to be at least 3 " })
    }
    const saltRounds = 10
    const passwordHashed = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username: username,
        name: name,
        passwordHashed: passwordHashed,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})


export default usersRouter
