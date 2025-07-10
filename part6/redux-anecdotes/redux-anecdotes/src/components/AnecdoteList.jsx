import { useSelector, useDispatch } from 'react-redux'
import { addVoteOf } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state)
    const dispatch = useDispatch()

    const vote = (id) => {
    dispatch(addVoteOf(id))
    }
    
    const viewAnec = () => {
    return anecdotes.sort((a, b) => b.votes - a.votes)
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
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList
