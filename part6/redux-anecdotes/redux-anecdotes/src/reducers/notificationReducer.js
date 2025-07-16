import { createSlice } from "@reduxjs/toolkit";

const initialState = ''


const notiSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNoti(state, action) {
            console.log(`You voted '${action.payload}'`)
            return `You voted '${action.payload}'`
        },

        clearNoti(state, action){
            console.log(`CLEAR`)
            return null
        }
    }
})


export const { setNoti, clearNoti } = notiSlice.actions
    // dispatch(setNoti(content))
    // setTimeout(() => dispatch(clearNoti()), 5000)
export const setNotification = (content, time)=> {
    return async dispatch => {
        dispatch(setNoti(content))
        setTimeout(() => dispatch(clearNoti()), time * 1000)
    }
}
export default notiSlice.reducer
