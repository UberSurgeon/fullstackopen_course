import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import Person from './models/person.js'
const app = express()
app.use(express.json())
morgan.token('content', function (req) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

dotenv.config()

// Person.find({}).then(persons =>{
//     console.log(persons)
// })


// let persons = [
//   {
//     'id': '1',
//     'name': 'Arto Hellas',
//     'number': '040-123456'
//   },
//   {
//     'id': '2',
//     'name': 'Ada Lovelace',
//     'number': '39-44-5323523'
//   },
//   {
//     'id': '3',
//     'name': 'Dan Abramov',
//     'number': '12-43-234345'
//   },
//   {
//     'id': '4',
//     'name': 'Mary Poppendieck',
//     'number': '39-23-6423122'
//   }
// ]

app.use(express.static('dist'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', async(request, response) => {
  const count = await Person.countDocuments()
  const currentTime = new Date()
  response.send(`
            <p>Phonebook has info for ${count} people</p>
            <p>${currentTime}</p>
        `)
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(note => {
    response.json(note)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      console.log(result)
      response.status(204).end()
    })
    .catch(error => next(error))
})

const puttingfunc = (Person, id, name, number, next, response) => {
  Person.findById(id)
    .then(person => {
      if (!person){
        response.status(400).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        console.log(updatedPerson)
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
}

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  // console.log("BUFFER", content, important)
  puttingfunc(Person, request.params.id, name, number, next, response)

})

// const generateId = () => {
//     return Math.floor(Math.random() * 10001)
// }



app.post('/api/persons', async (request, response, next) => {
  const body = request.body
  if(!body.name){
    return response.status(400).json({
      error: 'name missing'
    })
  } else if (!body.number){
    return response.status(400).json({
      error: 'number missing'
    })
  }

  Person.find({ name: body.name })
    .then(result => {
      console.log(result)
      if (result.length > 0){
        console.log('IDENTICAL')
        console.log('FROM post')
        const id = result[0]._id.toString()
        console.log('ID', id)
        const { name, number } = request.body
        puttingfunc(Person, id, name, number, next, response)
        return response.status(200).end()
        //         return response.status(404).end()
      } else {
        //console.log("UNINDENTICAL")
        const person = new Person ({
          name: body.name,
          number: body.number
        })


        person.save().then(savedPerson => {
          console.log(person)
          console.log(savedPerson)
          // response.json(person)
        }).catch(error => next(error))

      }
      // return response.status(200).end()
    })

})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandle = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError'){
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandle)

const PORT = process.env.PORT
app.listen(PORT)

console.log(`Server running on port ${PORT}`)
