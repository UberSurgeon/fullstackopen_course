
import AnecdoteForm from './components/AncecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import VisFilter from './components/visFilter'
import Notification from './components/Notification'

const App = () => {


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
