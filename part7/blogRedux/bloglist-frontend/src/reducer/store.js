import { configureStore } from '@reduxjs/toolkit';
import notiReducer from './notificationReducer'
import blogReducer from './blogReducer'
import userReducer from './userReducer'

const store = configureStore({
  reducer: {
    notification: notiReducer,
    blog: blogReducer,
    user: userReducer
  }
})

export default store
