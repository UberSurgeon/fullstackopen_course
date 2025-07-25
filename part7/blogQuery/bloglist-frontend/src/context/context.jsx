import { useReducer, createContext } from "react"
import notiReducer from '../reducer/notificationReducer'
import userReducer from "../reducer/userReducer"


const Context = createContext()

export const ContextProvider = (props) => {
  const [noti, notiDispatch] = useReducer(notiReducer, null)
  const [user, userDispatch] = useReducer(userReducer, null)


  return (
    <Context.Provider value={{
      noti,
      notiDispatch,
      user,
      userDispatch}}>
      {props.children}
    </Context.Provider>
  )
}

export default Context
