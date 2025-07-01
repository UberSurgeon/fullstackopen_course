import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import PropTypes from 'prop-types'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [notification, setNewNotification] = useState(null)
    const [color, setNewColor] = useState('red')
    const [newId, setNewId] = useState('')
    const [refresh, setNewRefresh] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            const loggedUserJson = window.localStorage.getItem('logged')
            console.log(loggedUserJson)
            if(loggedUserJson){
                const user = JSON.parse(loggedUserJson)
                setUser(user)
                try{
                    const allblogs = await blogService.getAll()
                    const fblogs = await allblogs.filter(blog => blog.users.some(leuser => leuser.username === user.username))
                    setBlogs(fblogs)
                    console.log('FLOG', fblogs)
                    if (fblogs[0]?.users[0]?.id) {
                        const id = fblogs[0].users[0].id
                        console.log('ID EXIST',id)
                        setNewId(id)
                        console.log('id', newId)
                    }
                } catch (exception){
                    console.error('Fail', exception)
                }

            }
        }

        fetchData()
    }, [newId, refresh])

    const handleLogin = async (event) => {
        event.preventDefault()
        try{
            const user = await loginService.login({
                username, password
            })
            console.log(user)
            window.localStorage.setItem(
                'logged', JSON.stringify(user)
            )
            setUser(user)
            setUsername('')
            setPassword('')
        }catch (exception) {
            setNewNotification('wrong username or password')
            setTimeout(() => {
                setNewNotification(null)
                setNewColor('red')
            }, 5000)
            console.log('ERROR', exception)
        }
    }

    const handleLogout = async (event) => {
        event.preventDefault()
        window.localStorage.clear()
        setNewId('')
        console.log('DELETE')
        setNewRefresh('asda')
        window.location.reload()
    }

    const handleLike = async (ph, blogobject) => {
        console.log('LIKE', ph)
        console.log('content', blogobject)
        const sendobject = {
            title: blogobject.title,
            author: blogobject.author,
            url: blogobject.url,
            likes: blogobject.likes + 1,
            users: newId
        }
        console.log('SENDING', sendobject)
        try{
            const token = await blogService.setToken(user.token)
            console.log('TOKEN', token)
            const result = await blogService.like(ph, sendobject)
            console.log(result)
            setNewRefresh('asda')
            setTimeout(() => {
                setNewRefresh('')
            }, 1000)
        } catch (exception) {
            console.log('error', exception)
        }
    }

    const handleRemove = async (ph, blogObject) => {
        console.log('remove', ph)
        try{
            window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)
            const token = await blogService.setToken(user.token)
            console.log('TOKEN', token)
            const result = await blogService.remove(ph)
            console.log('result', result)
            setNewRefresh('asda')
            setTimeout(() => {
                setNewRefresh('')
            }, 1000)

        } catch(exception){
            console.log('error', exception)
        }
    }

    const createNewBlog = async (blogObject) => {
        console.log('CREATING')
        try{
            const token = await blogService.setToken(user.token)
            console.log('TOKEN', token)

            blogObject = { ...blogObject, users: newId }
            console.log(blogObject)
            const result = await blogService.create(blogObject)
            console.log(result)
            setNewNotification(
                `a new blog ${blogObject.title} by ${blogObject.author}`
            )
            setNewColor('green')
            setNewRefresh('asda')
            setTimeout(() => {
                setNewNotification(null)
                setNewColor('red')
                setNewRefresh('')
            }, 5000)
        } catch(exception){
            console.log('ERROR', exception)
        }


    }

    const newBlogForm = () => {
        return(
            <Togglable buttonLabel={'Create Blog'} buttonLabelEnd="Cancel">
                <BlogForm createNewBlog={createNewBlog}></BlogForm>
            </Togglable>
        )
    }

    const loginForm = () => {
        return(
            <form onSubmit={handleLogin}>
                <div>
          username
                    <input
                        id='username'
                        type='text'
                        value={username}
                        name='Username'
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
          password
                    <input
                        id='password'
                        type='password'
                        value={password}
                        name='Password'
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type='submit'>login</button>
            </form>
        )
    }



    const Notification = () => {
        if (notification === null) {
            return null
        }

        const style = {
            color: color,
            background: 'lightgrey',
            fontSize: '20px',
            borderStyle: 'solid',
            borderRadius: '5px',
            padding: '10px',
            marginBottom: '10px'
        }

        return <div style={style}>{notification}</div>
    }


    const showUser = () => {
        return(
            <div>
                <p>{user.name} logged in</p>
                <button onClick={handleLogout} type='submit'>logout</button>
                {newBlogForm()}
                {showBlog()}
            </div>
        )
    }

    const showBlog = () => {
        const style = {
            paddingTop: 10,
            paddingLeft: 2,
            border: 'solid',
            borderWidth: 1,
            marginBottom: 5
        }
        return(
            <>
                {
                    blogs.sort((a, b) => b.likes - a.likes).map( blog =>
                        <div key={blog.id} style={style}>
                            <Blog key={blog.id} blog={blog} handleLike={handleLike} handleRemove={handleRemove}/>
                        </div>
                    )
                }
            </>
        )
    }

    return (
        <div>
            <div>
                <Notification />
                {user === null ?
                    <div>
                        <h2>log in to application</h2>
                        {loginForm()}
                    </div> :
                    <div>
                        <h2>blogs</h2>
                        {showUser()}
                    </div>
                }

            </div>

        </div>
    )
}

export default App
