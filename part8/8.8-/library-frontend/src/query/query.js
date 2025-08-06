import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      bookCount
      born
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author
      published
      genres
      id
    }
  }
`

export const ALL_BOOKS_GENRES = gql`
  query($genre: [String]) {
    allBooks(genre: $genre) {
      title
      author
      published
      genres
      id
    }
  }
`

export const ADD_BOOK = gql`
  mutation ($title: String, $author: String, $published: Int, $genres: [String]) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      title
      author
      published
      genres
      id
    }
  }
`

export const EDIT_BIRTH = gql`
  mutation ($name: String, $setBornTo: Int) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      bookCount
      born
    }
}`


export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password){
    value
  }}
`

export const ME = gql`
  query Me {
  me {
    username
    favoriteGenre
    id
  }
}
`
