import express, {request, response} from "express"
import morgan from "morgan"
const app = express()
app.use(express.json())
morgan.token('content', function (req, res) { 
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.static('dist'))

app.get('/api/persons', (request, response) => {
    response.send(persons)
})

app.get('/info', (request, response) => {
    const count = persons.length
    const currentTime = new Date()
    response.send(`
            <p>Phonebook has info for ${count} people</p>
            <p>${currentTime}</p>
        `)
})

app.get('/api/persons/:id', (request, response) =>{
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person){
        response.send(person)
    } else {
        response.status(400).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * 10001)
}

app.post('/api/persons', (request, response)=>{
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

    if (persons.some(person => person.name === body.name)){
        return response.status(400).json({
        error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    // console.log('post')
    // console.log(person)
    response.json(person)
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
