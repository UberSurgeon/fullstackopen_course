import { useSelector } from "react-redux"

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
