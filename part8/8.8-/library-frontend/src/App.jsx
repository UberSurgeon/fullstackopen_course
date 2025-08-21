
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Recommend from "./components/Recommend";
import { Link, Routes, Route} from 'react-router-dom'
import { useState } from "react";
import LoginForm from "./components/login";
import { useApolloClient, useSubscription } from '@apollo/client'
import { BOOK_ADDED } from "./query/query";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('logged-in-usertoken') ? localStorage.getItem('logged-in-usertoken') : null)
  const client = useApolloClient()
  const padding = {
    paddingRight: 5
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      window.alert(data.data.addBook.title)
    }
  })

  if (!token) {
    return <LoginForm setToken={setToken}/>
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()

  }

  return (
    <div>

      <div>
        <Link to={'/'} style={padding} >authors</Link>
        <Link to={'/book'} style={padding} >books</Link>
        <Link to={'/addbook'} style={padding} >add book</Link>
        <Link to={'/recommend'} style={padding} >recommend</Link>
        <button onClick={logout}> logout </button>

      </div>
      <Routes>
        <Route path='/' element={<Authors  />} />
        <Route path='/book' element={<Books />} />
        <Route path='/addbook' element={<NewBook />} />
        <Route path='/recommend' element={<Recommend />} />
      </Routes>
    </div>
    
  );
};

export default App;
