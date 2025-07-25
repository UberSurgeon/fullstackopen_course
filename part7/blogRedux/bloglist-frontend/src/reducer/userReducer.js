import { createSlice } from '@reduxjs/toolkit'


const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser(state, action) {
      return {}
    }
  }
})


export const { setUser, clearUser } = userSlice.actions

export const initializeUser = (user) => {
  return async dispatch  => {
    dispatch(setUser(user))
  }
}

export const cleanUser = () => {
  return async dispatch => {
    dispatch(clearUser())
  }
}

export default userSlice.reducer

