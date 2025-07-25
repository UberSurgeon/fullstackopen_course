import { createSlice, current } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification(state, action) {
      return null
    }
  }

})

export const { setNotification, clearNotification } = notificationSlice.actions

export const createNotification = (content, time, setColor, color_s) => {
  return dispatch => {
    dispatch(setNotification(content))
    setColor(color_s)
    setTimeout(() => {
      dispatch(clearNotification())
      setColor(null)
    }, time * 1000)
  }
}

export default notificationSlice.reducer
