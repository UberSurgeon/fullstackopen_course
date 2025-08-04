
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { Link, Routes, Route} from 'react-router-dom'


const App = () => {
  const padding = {
    paddingRight: 5
  }

  return (
    <div>

      <div>
        <Link to={'/'} style={padding} >authors</Link>
        <Link to={'/book'} style={padding} >books</Link>
        <Link to={'/addbook'} style={padding} >add book</Link>

      </div>
      <Routes>
        <Route path='/' element={<Authors  />} />
        <Route path='/book' element={<Books />} />
        <Route path='/addbook' element={<NewBook />} />
      </Routes>

    </div>
  );
};

export default App;
