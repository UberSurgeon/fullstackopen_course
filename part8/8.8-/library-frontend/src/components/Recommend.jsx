import { useQuery } from "@apollo/client"
import { ME, ALL_BOOKS_GENRES } from "../query/query"
import { useState } from "react"


const Recommend = () => {
    const uGenre = useQuery(ME)
    const result = useQuery(ALL_BOOKS_GENRES, {variables: {genre: uGenre.data.me.favoriteGenre},
    skip: !uGenre.data.me.favoriteGenre })
    if(uGenre.loading){
        return <h1>loading</h1>
    }
    // console.log(uGenre.data.me.favoriteGenre)
    // console.log(result)

    const books = result.data.allBooks
    
    return (
        <div>
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
      </div>
    )
    
}

export default Recommend
