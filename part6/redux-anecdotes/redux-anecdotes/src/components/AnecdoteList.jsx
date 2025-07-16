import { useSelector, useDispatch } from 'react-redux'
import { voteAnec } from '../reducers/anecdoteReducer'
import { setNotification} from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(({filter, anec}) => {
        if (filter === '') {
            return anec
        }
        return anec.filter(idAnec => idAnec.content.includes(filter) )
    })
    const dispatch = useDispatch()

    const vote = (id, content) => {
    dispatch(voteAnec(id))
    dispatch(setNotification(content, 10))
    }
    
    const viewAnec = () => {
        const sortAnec = [...anecdotes].sort((a, b) => b.votes - a.votes)
        return sortAnec

    }

    return (
    <div>
      {viewAnec().map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList
