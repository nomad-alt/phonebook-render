require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (request) => {
  if (request.method !== 'POST') {
    return ''
  }

  return JSON.stringify(request.body)
})

app.use(
  morgan((tokens, req, res) => {
    const base = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
    ].join(' ')

    const body = tokens.body(req, res)
    return body ? `${base} ${body}` : base
  })
)

const Person = require('./models/note')

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons)
    })
    .catch(next)
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(next)
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then((count) => {
      const timestamp = new Date()
      response.send(
        `<div>
          <p>Phonebook has info for ${count} people</p>
          <p>${timestamp}</p>
        </div>`
      )
    })
    .catch(next)
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({ error: 'name and number are required' })
  }

  Person.findOne({ name })
    .then((existing) => {
      if (existing) {
        return response.status(400).json({ error: 'name must be unique' })
      }

      const person = new Person({ name, number })

      return person.save().then((savedPerson) => {
        response.status(201).json(savedPerson)
      })
    })
    .catch(next)
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(next)
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).end()
      }
    })
    .catch(next)
})

const errorHandler = (error, request, response) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  if (error.name === 'MongoServerError' && error.code === 11000) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  return response.status(500).json({ error: 'internal server error' })
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
