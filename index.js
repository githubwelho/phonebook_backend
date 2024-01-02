const express = require('express')
const app = express()
const currentDate = new Date()
const morgan = require('morgan')

app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body, null))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "0010001000"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "349140989"
  },
  {
    id: 3,
    name: "Mary Poppendick",
    number: "2143351323"
  }
]

app.get('/', (req, res) => {
    res.send('<h1>Puhelinluottelo jee!</h1>')
})

app.get(('/info'), (req, res) => {
    res.send(
    '<div>Phonebook has info for '+persons.length+' people</div>'+'<div>'+currentDate+'</div>'
    )
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }  
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }  
})

const generateId = () => {
    return Math.floor((Math.random()*100*persons.length) + persons.length*100)
  }
  
app.post('/api/persons', (request, response) => {

    const body = request.body
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'name or/and number missing' 
      })
    }

    if (persons.map(person => person.name).includes(body.name)) {
        return response.status(400).json({
            error: 'person is already in the phonebook'
        })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})