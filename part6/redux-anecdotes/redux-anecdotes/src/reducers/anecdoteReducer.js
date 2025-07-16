import { createSlice, current } from "@reduxjs/toolkit"
import anecdotesService from "../service/anecdotes"

// const anecdotesAtStart = [
//   'If it hurts, do it more often',
//   'Adding manpower to a late software project makes it later!',
//   'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
//   'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
//   'Premature optimization is the root of all evil.',
//   'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
// ]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

// const initialState = anecdotesAtStart.map(asObject)

// const reducer = (state = initialState, action) => {
//   console.log('state now: ', state)
//   console.log('action', action)

//   switch(action.type) {
//     case 'VOTE': {
//       const id = action.payload.id
//       const anecToChange = state.find( n => n.id === id)
//       const changedAnec = {
//         ...anecToChange,
//         votes: anecToChange.votes + 1
//       }

//       return state.map(anec => anec.id !== id ? anec: changedAnec)
//     }
//     case 'NEW_ANEC': {
//       return [...state, action.payload]
//     }
//     default:
//       return state
//   }
// }

const anecSlice = createSlice({
  name: 'anec',
  initialState: [],
  reducers: {
    // createAnec(state, action) {
    //   state.push(action.payload)
    // },
    addVoteOf(state, action) {

      const id = action.payload
      const anecToChange = state.find( n => n.id === id)
      const changedAnec = {
        ...anecToChange,
        votes: anecToChange.votes + 1
      }

      return state.map(anec => anec.id !== id ? anec: changedAnec)
    },
    setAnec(state, action) {
      return action.payload
    },
    appendAnec(state, action) {
      state.push(action.payload)
    }
  }
})


// export const addVoteOf = (id) => {
//   return{
//     type: 'VOTE',
//     payload: { id }
//   }
// }

// export const createAnec = (content) => {
//   return {
//     type: 'NEW_ANEC',
//     payload: {
//       content,
//       id: getId(),
//       votes: 0
//     }
//   }
// }

export const { addVoteOf, setAnec, appendAnec } = anecSlice.actions
export const initialAnec = () => {
  return async dispatch => {
    const content = await anecdotesService.getAll()
    dispatch(setAnec(content))
  }
}
export const createAnec = content => {
  return async dispatch => {
    const newAnec = await anecdotesService.createNew(content)
    dispatch(appendAnec(newAnec))
  }
}
export const voteAnec = id => {
  return async dispatch => {
    const content = await anecdotesService.getAll()
    const anecToChange = content.find(n => n.id === id)
    const changedAnec = {
        ...anecToChange,
        votes: anecToChange.votes + 1
      }
    await anecdotesService.addVote(id, changedAnec)
    dispatch(addVoteOf(id))
  }
}
export default anecSlice.reducer
