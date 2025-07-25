import { createSlice, current } from '@reduxjs/toolkit'
import blogServices from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlog(state, action) {
      return action.payload
    },
    likeBlog(state, action){
      const id = action.payload
      const blogToChange = state.find(n => n.id === id)
      const changedBlog = {
        ...blogToChange, likes: blogToChange.likes +1
      }
      console.log(current(state))

      return state.map(blog => blog.id !== id ? blog : changedBlog)
    },
    deleteBlog(state, action){
      const id = action.payload
      return state.filter(blog => blog.id !== id)
    }
  }
})

export const { setBlog, deleteBlog, likeBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogServices.getAll()
    dispatch(setBlog(blogs))
  }
}

export const likingBlogs = (id) => {
  return dispatch => {
    dispatch(likeBlog(id))
  }
}

export const deletingBlogs = (id) => {
  return dispatch => {
    dispatch(deleteBlog(id))
  }
}

export default blogSlice.reducer
