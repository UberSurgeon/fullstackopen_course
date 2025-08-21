import { useQuery } from "@apollo/client"
import { ALL_BOOKS, ALL_BOOKS_GENRES } from "../query/query"
import { useEffect, useState } from "react"
import { useSubscription } from "@apollo/client"
import { BOOK_ADDED } from "../query/query"

const Books = (props) => {
  // if (!props.show) {
  //   return null
  // }
  const [genre, setGenre] = useState(null)



  const result = useQuery(ALL_BOOKS_GENRES, {variables: {genre}})

  useSubscription(BOOK_ADDED, {
      onData: ({ data }) => {
        result.refetch({variables: {genre}})
      }
    })
  
  if (result.loading) {
    return <div>loading...</div>
  }




  const books = result.data.allBooks

  const GenreButton = () => {
    const flatmap = books.flatMap(book => book.genres)
    const buttonSet = Array.from(new Set(flatmap))

    return(
      <div>
        {buttonSet.map(genre => (
          <button key={genre} onClick={() => {setGenre(genre)}}>{genre}</button>
        ))}
        <button onClick={() => {setGenre(null)}}>all genre</button>
      </div>
    )
  }


  console.log(books)

  

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <GenreButton />
    </div>
  )
}

export default Books
