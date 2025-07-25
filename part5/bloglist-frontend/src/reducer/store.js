import { configureStore } from '@reduxjs/toolkit';
import notiReducer from './notificationReducer'

const store = configureStore({
  reducer: {
    notification: notiReducer,
  }
})

export default store
