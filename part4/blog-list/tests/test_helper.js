import Blog from "../models/blog.js"
import User from "../models/user.js"

const initalBlogs = [
            {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'ddawda W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '9f4a6c1b2d8e4375a6f0c3e1',
            title: 'Go To Statement Considered Harmful',
            author: 'Robert C. Martin',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
    ]

const initalUser = [
    {
        username: "tuye",
        name: "tuye rabbit",
        passwordHashed: "$2b$10$n/xKq6JUVRPNSJ2C1gqCxex.4NNDbVlareSoEabinieU8x3iWtwv6"
    },
    {
        username: "sibuxiang",
        name: "sibuxiang deer",
        passwordHashed: "$2b$10$NjKbDCgFki45KWIFqkWMp.aHlefMwVpMf7Gj2zu.l5gn9Rt3lcVku"
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

export default {initalBlogs, initalUser, blogsInDb, usersInDb}
