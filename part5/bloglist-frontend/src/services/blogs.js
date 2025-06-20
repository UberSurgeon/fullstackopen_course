import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = async (newToken) => {
    token = `Bearer ${newToken}`
    return token
}

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const create = async(newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  console.log(config)
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

export default { getAll, setToken, create }
