import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newblogs, setNewblogs] = useState({title: '', author: '', url: '', users: ''})
  const [notification, setNewNotification] = useState(null)
  const [color, setNewColor] = useState("red")

  useEffect(() => {
    const fetchData = async () => {
      const loggedUserJson = window.localStorage.getItem('logged')
      console.log(loggedUserJson)
      if(loggedUserJson){
        const user = JSON.parse(loggedUserJson)
        setUser(user)
        try{
          const allblogs = await blogService.getAll()
          const fblogs = allblogs.filter(blog => blog.users.some(leuser => leuser.username == user.username))
          setBlogs(fblogs)
          if (blogs[0]?.users[0]?.id) {
            const id = blogs[0].users[0].id
            console.log(id)
            setNewblogs({...newblogs, users: id})
          }
        } catch (exception){
          console.error('Fail', exception)
        }
        
        
        console.log(blogs)

      }
      }
    
      fetchData()
  }, [])

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
      setNewNotification("wrong username or password")
      setTimeout(() => {
        setNewNotification(null)
        setNewColor("red")
      }, 5000)
      console.log('ERROR', exception)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.clear()
    console.log("DELETE")
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()
    try{
      const token = await blogService.setToken(user.token)
      console.log("TOKEN", token)
      console.log(newblogs)
      const result = await blogService.create(newblogs)
      console.log(result)
      setNewNotification(
          `a new blog ${newblogs.title} by ${newblogs.author}`
        )
      setNewColor("green")
      setTimeout(() => {
        setNewNotification(null)
        setNewColor("red")
      }, 5000)
      setNewblogs({title: '', author: '', url: ''})


    } catch(exception){
      console.log("ERROR", exception)
    }


  }

  const newBlogForm = () => {
    return(
      <form onSubmit={handleNewBlog}>
        <div>
          title:
          <input
            type='text'
            value={newblogs.title}
            name='title'
            onChange={({target}) => setNewblogs({...newblogs, title: target.value})}
          />
        </div>
        <div>
          author:
          <input
            type='text'
            value={newblogs.author}
            name='author'
            onChange={({target}) => setNewblogs({...newblogs, author: target.value})}
          />
        </div>
        <div>
          url
          <input
            type='text'
            value={newblogs.url}
            name='url'
            onChange={({target}) => setNewblogs({...newblogs, url: target.value})}
          />
        </div>
        <button type='submit'>create</button>
      </form>
    )
  }

  const loginForm = () => {
    return(
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type='text'
            value={username}
            name='Username'
            onChange={({target}) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type='password'
            value={password}
            name='Password'
            onChange={({target}) => setPassword(target.value)}
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
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px"
  }

  return <div style={style}>{notification}</div>
}


  const showUser = () => {
    return(
      <>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout} type='submit'>logout</button>
      {newBlogForm()}
      {showBlog()}
      </>
    )
  }

  const showBlog = () => {
    return(
      <>
      {
        blogs.map( blog => <Blog key={blog.id} blog={blog}/>)
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
