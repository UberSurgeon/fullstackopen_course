import { useSelector } from "react-redux"
import { useState } from "react"

const Notification = () => {
  const notification = useSelector(({noti}) => {
        return noti
  })

  const style = {
    display: notification != null ? 'block': 'none',
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification
