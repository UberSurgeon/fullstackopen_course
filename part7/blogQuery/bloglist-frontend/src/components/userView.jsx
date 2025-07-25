import { Link } from 'react-router-dom'

const UserView = ({ fullUser }) => {
  console.log('FULLLUSER', fullUser)
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>blogs created</th>
        </tr>
      </thead>
      <tbody>
        {fullUser.map(user => (
          <tr key={user.id}>
            <td><Link to={`./${user.id}`}>{user.username}</Link></td>
            <td>{user.blogs.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}


export default UserView
