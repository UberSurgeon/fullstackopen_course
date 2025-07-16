
import AnecdoteForm from './components/AncecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import VisFilter from './components/visFilter'
import Notification from './components/Notification'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { initialAnec } from './reducers/anecdoteReducer'
import { clearNoti } from './reducers/notificationReducer'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(clearNoti())
    dispatch(initialAnec())
  }, [])


  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <VisFilter />
      <AnecdoteList/>
      <AnecdoteForm />
    </div>
  )
}

export default App
