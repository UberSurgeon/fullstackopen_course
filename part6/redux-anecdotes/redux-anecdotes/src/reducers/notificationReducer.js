import { createSlice } from "@reduxjs/toolkit";

const initialState = ''


const notiSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNoti(state, action) {
            console.log(`You voted '${action.payload}'`)
            state = `You voted '${action.payload}'`
            return `You voted '${action.payload}'`
        },

        clearNoti(state, action){
            console.log(`CLEAR`)
            state = ''
            return null
        }
    }
})

export const { setNoti, clearNoti } = notiSlice.actions

export default notiSlice.reducer
