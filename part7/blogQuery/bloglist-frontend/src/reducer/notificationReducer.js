


const notiReducer = (state, action) => {
  switch (action.type) {
  case 'ERROR':
    return action.payload
  case 'LIKE':
    return action.payload
  case 'CREATED':
    return action.payload
  case 'CLEAR':
    return null
  default:
    return state
  }
}


export default notiReducer


