import { useQuery, useMutation } from "@apollo/client"
import { ALL_AUTHORS, EDIT_BIRTH } from "../query/query"
import { useState } from "react"

const Authors = () => {
  const [ name, setNewName ] = useState('')
  const [ setBornTo, setNewBornTo ] = useState('')

  const [ editBirth ] = useMutation(EDIT_BIRTH, {refetchQueries: [{query: ALL_AUTHORS}], 
    onError: (error) => console.log(error)
  }
  )

  const submit = async (event) => {
    event.preventDefault()
    
    editBirth({variables: {name, setBornTo}})
    console.log(`${name}, ${setBornTo}`)
    setNewName('')
    setNewBornTo('')
  }


  const result = useQuery(ALL_AUTHORS)

  if (result.loading) {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <form onSubmit={submit}>
          <div>
            {/* name <input type="text" value={name} onChange={({target}) => setNewName(target.value)}/> */}
            name <select name='authors' value={name} onChange={({target}) => setNewName(target.value)}>
              {authors.map((a) => (
                <option key={a.name} value={a.name} >{a.name}</option>
              ))}
            </select>
          </div>
          <div>
            born <input type="number" value={setBornTo} onChange={({target}) => setNewBornTo(Number(target.value))}/>
          </div>
          <button type="submit">update author</button>
        </form>
      </div>
    </div>
  )
}

export default Authors
