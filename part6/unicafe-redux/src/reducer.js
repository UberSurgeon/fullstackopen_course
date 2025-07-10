const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  const newstate = state
  switch (action.type) {
    case 'GOOD': 
      {const changedNote = {
            ...state,
            good: newstate.good + 1
        }
      state = changedNote
      console.log(state)
      return state}
    case 'OK':
      {const changedNote = {
            ...state,
            ok: newstate.ok + 1
        }
      state = changedNote
      console.log(state)
      return state}
    case 'BAD':
      {const changedNote = {
            ...state,
            bad: newstate.bad + 1
        }
      state = changedNote
      console.log(state)
      return state}
    case 'ZERO':
      {const changedNote = {
            ...state,
            ok: 0,
            good: 0,
            bad: 0
        }
      state = changedNote
      console.log(state)
      return state}
    default: return state
  }
  
}

export default counterReducer
