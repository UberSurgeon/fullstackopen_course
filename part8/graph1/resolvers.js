const { GraphQLError, subscribe } = require('graphql')
const jwt = require('jsonwebtoken')
const Books = require('./models/books')
const Author = require('./models/author');
const User = require('./models/user')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()



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
      const books =  await Books.find({})
      return author.map(a => ({
        name: a.name,
        born: a.born,
        bookCount: books.filter(b => String(b.author) == String(a._id)).length
      }))
    },

    me: async (root, args, {currentUser}) => {
      return currentUser
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

      pubsub.publish('BOOK_ADDED', { addBook: book })

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
  },

  Subscription: {
      addBook: {
        subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
      },
    },
}

module.exports = resolvers
