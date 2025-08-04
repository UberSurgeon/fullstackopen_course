const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v4: uuid } = require('uuid');
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Books = require('./models/books')
const Author = require('./models/author');
// const author = require('./models/author');
const User = require('./models/user')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

const JWT_SECRET = process.env.JWT_SECRET

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected')
  })
  .catch((error) => {
    console.log('ERROR', error.message)
  })

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

/*
  you can remove the placeholder query once your first one has been implemented 
*/

const typeDefs = `
  type Book {
    title: String
    author: String
    published: Author
    genres: [String!]!
    id: ID
  }
  
  type Author {
    name: String
    bookCount: Int
    born: Int
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: [String]): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title:String
      author: String
      published: Int
      genres: [String]
    ): Book

    editAuthor(
    name: String
    setBornTo: Int
    ):Author

    createUser(
      username: String!
      favoriteGenre: String!
  ): User

    login(
      username: String!
      password: String!
  ): Token
  }


`

const resolvers = {
  Query: {
    bookCount: async () => {
        const book = await Books.find({})
        return book.length
    },
    authorCount: async () => {
      const book = await Books.find({})
      aCount = new Set(book.map(book => book.author.toString())).size
      return aCount
    },
    allBooks: async (root, args) => {
      console.log("AUTHOR", args.author)
      console.log("GENRE", args.genre)
      if(!args.author && !args.genre) {
        return await Books.find({})
      }

      if(args.author && !args.genre){
        try{
          return await Books.find({author: args.author})
        } catch (error) {
          throw new GraphQLError('input error', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
      }

      if(args.genre && !args.author){
        try{
          return await Books.find({genres: { $in: args.genre }})
        }catch (error){
          throw new GraphQLError('inpuit error', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.genre,
              error
            }
          })
        }
        
      }

      if(args.genre && args.author){
        try{
          return await Books.find({author: args.author, genres: { $in: args.genre}})
        } catch (error){
          throw new GraphQLError('input error', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args,
              error
            }
          })
        }
        
      }
      
    },
    allAuthors: async () => {
      const author = await Author.find({})
      return author.map(a => ({
        name: a.name,
        born: a.born,
        bookCount: books.filter(b => b.author == a.name).length
      }))
    }
  },

  Mutation: {
    addBook: async(root, args, {currentUser}) => {
      if(!currentUser){
          throw new GraphQLError('wrong credential', {
            extensions: { code: 'BAD_USER_INPUT' }
          })
      }
      
      let author = await Author.findOne({name: args.author})
      
      if (!author){
        const author = new Author({ name: args.author, born: null})
        try{ 
          await author.save()
        } catch (error){
          throw new GraphQLError('Saving number failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
            error
          }
        })
        }
      }

      const book = new Books({...args, author: author._id})
      console.log('ARGS genre', args.genres)


      try {
        await book.save()
        
      } catch (error){
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
            error
          }
        })
      }

      return book
    },

    editAuthor: async (root, args, {currentUser}) => {
      if(!currentUser){
          throw new GraphQLError('wrong credential', {
            extensions: { code: 'BAD_USER_INPUT' }
          })
      }
      

      const author = await Author.findOne({name: args.name})
      if (!author) {
        return null
      }
      console.log('NAME', args.name)
      console.log('BORN', args.setBornTo)
      author.born = args.setBornTo
      console.log('UDATE', author)
      try{
        await author.save()
      }
      catch(error) {
        throw new GraphQLError('saving error', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.setBornTo,
            error
          }
        })
      }
      return author

    },

    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

      try {
        return await user.save()
      } catch (error) {
        throw new GraphQLError('create the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      }
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET)}
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({req, res}) => {
    const auth = req ? req.headers.authorization: null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)

      return {currentUser}
    }
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
