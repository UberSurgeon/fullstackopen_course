import { useState, useEffect, useContext } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from 'react-redux'
import context from "./context/context";
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import userService from './services/users'
import UserView from "./components/userView";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom"
import { Nav, Navbar } from 'react-bootstrap'

const App = () => {
  const queryClient = useQueryClient()
  const { noti, notiDispatch, user, userDispatch } = (useContext(context))
  const likeBlogMutation = useMutation({
    mutationFn: ({ id, updatedblogs }) => blogService.like(id, updatedblogs),
    onSuccess: () => queryClient.invalidateQueries('blogs') })
  const commentBlogMutation = useMutation({
    mutationFn: ({ id, comment  }) => blogService.createComment(id, comment),
    onSuccess: () => queryClient.invalidateQueries('blogs') })

  const deleteBlogMutation = useMutation({
    mutationFn: (id) => blogService.remove(id),
    onSuccess: () => queryClient.invalidateQueries('blogs')
  })

  // const setNewNotification = useMutation({ mutationFn: addVote, onSuccess: })

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [user, setUser] = useState(null);
  const [color, setNewColor] = useState("null");
  const [newId, setNewId] = useState("");



  const blogsResult = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false
  })

  const userResult = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    refetchOnWindowFocus: false
  })

  // if (userResult.isFetched) {
  //   console.log('USERRESULT', userResult.data)
  // }

  useEffect(() => {
    const fetchUser = async () => {
      const loggedUserJson = window.localStorage.getItem("logged");
      console.log(loggedUserJson);
      if (loggedUserJson) {
        const user = JSON.parse(loggedUserJson);
        userDispatch({ type: 'SET', payload: user })
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchData = () => {
      if(blogsResult.data && user?.username){
        const fblogs = blogsResult.data.filter((blog) =>
          blog.users.some((leuser) => leuser.username === user.username),
        );
        console.log("FLOG", fblogs);
        if (fblogs[0]?.users[0]?.id) {
          const id = fblogs[0].users[0].id;
          console.log("ID EXIST", id);
          setNewId(id);
          // console.log("id", newId);
        }
      }
    }
    fetchData()
  }, [blogsResult.data, user?.username])


  // const blogs = blogsResult.data.filter((blog) =>
  //   blog.users.some((leuser) => leuser.username === user.username),
  // )

  //   if (blogsResult.isLoading){
  //   return <div>loading data...</div>
  // }

  // if (blogsResult.isError){
  //   return <div>prob in server</div>
  // }

  const createNotification = (type, content, time, color_s) => {
    const newObject = {
      type,
      payload: content
    }
    notiDispatch(newObject)
    setNewColor(color_s)
    setTimeout(() => {
      notiDispatch(clearNotification())
    }, time * 1000)
  }

  const clearNotification = () => {
    return { type: 'CLEAR' }
  }


  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      console.log(user);
      window.localStorage.setItem("logged", JSON.stringify(user));
      userDispatch({ type: 'SET', payload: user })
      setUsername("");
      setPassword("");
    } catch (exception) {
      createNotification('ERROR','wrong username or password', 5, 'red')
      console.log("ERROR", exception);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    window.localStorage.clear();
    setNewId("");
    console.log("DELETE");
    // setNewRefresh("asda");
    window.location.reload();
  };

  const handleComment = async (id, comment) => {
    const sendobject = {
      comment
    }
    // console.log('idcomment', id)
    // console.log('comment', comment)
    // console.log('objcomment', sendobject)
    try{
      const token = await blogService.setToken(user.token);
      console.log("TOKEN", token);
      commentBlogMutation.mutate({ id: id, comment: sendobject })
    } catch(exception){
      console.log(exception)
    }
  }

  const handleLike = async (ph, blogobject) => {
    console.log("LIKE", ph);
    console.log("content", blogobject);
    const sendobject = {
      title: blogobject.title,
      author: blogobject.author,
      url: blogobject.url,
      likes: blogobject.likes + 1,
      users: newId,
    };
    console.log("SENDING", sendobject);
    try {
      const token = await blogService.setToken(user.token);
      console.log("TOKEN", token);
      likeBlogMutation.mutate({ id:ph, updatedblogs: sendobject })
      // const result = await blogService.like(ph, sendobject);
      // console.log(result);
      // setNewRefresh("asda");
      // setTimeout(() => {
      //   setNewRefresh("");
      // }, 1000);
    } catch (exception) {
      console.log("error", exception);
    }
  };

  const handleRemove = async (ph, blogObject) => {
    console.log("remove", ph);
    try {
      window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`);
      const token = await blogService.setToken(user.token);
      console.log("TOKEN", token);
      deleteBlogMutation.mutate(ph)
      // const result = await blogService.remove(ph);
      // console.log("result", result);
      // setNewRefresh("asda");
      // setTimeout(() => {
      //   setNewRefresh("");
      // }, 1000);
    } catch (exception) {
      console.log("error", exception);
    }
  };

  const createNewBlog = async (blogObject) => {
    console.log("CREATING");
    try {
      const token = await blogService.setToken(user.token);
      console.log("TOKEN", token);

      blogObject = { ...blogObject, users: newId };
      console.log(blogObject);
      const result = await blogService.create(blogObject);
      console.log(result);
      createNotification('CREATED',`a new blog ${blogObject.title} by ${blogObject.author}`, 5, 'green')

    } catch (exception) {
      console.log("ERROR", exception);
    }
  };

  const newBlogForm = () => {
    return (
      <Togglable buttonLabel={"Create Blog"} buttonLabelEnd="Cancel">
        <BlogForm createNewBlog={createNewBlog}></BlogForm>
      </Togglable>
    );
  };

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    );
  };

  const Notification = () => {
    if (noti === null) {
      return null;
    }

    const style = {
      color: color,
      background: "lightgrey",
      fontSize: "20px",
      borderStyle: "solid",
      borderRadius: "5px",
      padding: "10px",
      marginBottom: "10px",
    };

    return <div style={style}>{noti}</div>;
  };

  const showUser = () => {
    const padding = {
      paddingRight: 5
    }
    return (
      <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className="me-auto">
            <Nav.Link as={Link} to='/'>blogs</Nav.Link>
            <Nav.Link as={Link} to='/users'>users</Nav.Link>
          </Nav>
          <Nav>
            <Navbar.Text className="me-2">
              {user.name} logged in
            </Navbar.Text>
            <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
        logout
            </button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  };

  const showBlog = () => {
    const style = {
      paddingTop: 10,
      paddingLeft: 2,
      border: "solid",
      borderWidth: 1,
      marginBottom: 5,
    };

    if (!blogsResult.data || !user?.username){
      return <h1>LOADING</h1>
    }

    const fblogs = blogsResult.data.filter((blog) => blog.users.some((leuser) => leuser.username === user.username))


    return (
      <>
        {fblogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <div key={blog.id} style={style}>
              <Link to={`./blogs/${blog.id}`}>{blog.title}</Link>
            </div>
          ))}
      </>
    );
  };


  const SingularBlogView = () => {
    const { id } = useParams();

    if (!blogsResult.isFetched) {
      return <p>Loading user...</p>;
    }

    const fBlog = blogsResult.data.find(blog => blog.id === id);

    if (!fBlog) {
      return <p>Blog not found.</p>;
    }

    return  <Blog
      key={fBlog.id}
      blog={fBlog}
      handleLike={handleLike}
      handleRemove={handleRemove}
      handleComment={handleComment}
    />;
  };




  const MainView = () => {
    return (<div>
      {newBlogForm()}
      {showBlog()}
    </div>)
  }

  const FullUserView = () => {
    return (
      <div>

        <h2>Users</h2>
        {userResult.isFetched
          ? <UserView fullUser={userResult.data} />
          : <p>Loading user...</p>}

      </div>
    )
  }

  const SingleUser = ({ fUser }) => {


    return (
      <div>
        <h2>{fUser.username}</h2>
        <h3>added blogs</h3>
        <ul>
          {fUser.blogs.map(blog => <li key={blog.id}>{blog.title}</li>)}
        </ul>
      </div>
    )
  }

  const SingularUserView = () => {
    const { id } = useParams();

    if (!userResult.isFetched) {
      return <p>Loading user...</p>;
    }

    const fUser = userResult.data.find(user => user.id === id);

    if (!fUser) {
      return <p>User not found.</p>;
    }

    return <SingleUser fUser={fUser} />;
  };

  return (
    <div className='container'>
      <Notification />
      <div>
        {user === null ? (
          <div>
            <h2>log in to application</h2>
            {loginForm()}
          </div>
        ) : (
          <div>
            {showUser()}
            <h2>blog app</h2>
          </div>
        )}
        <Routes>
          <Route path='/' element={<MainView/>}/>
          <Route path='/users' element={<FullUserView/>}/>
          <Route path='/users/:id' element={<SingularUserView/>} />
          <Route path='/blogs/:id' element={<SingularBlogView/>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
