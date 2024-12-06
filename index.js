const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', function (req) { return JSON.stringify(req.body) })

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const generateId = () => {
    newid = Math.floor(Math.random() * 1000)
    return newid.toString()
}

app.get("/", (request, response) => {
    response.send("Hello World!")
})

app.get("/api/persons", (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(error => next(error))
})

app.get("/info", (request, response) => {
    let recieved = new Date().toLocaleString()
    Person.countDocuments({})
        .then(count => {
            response.send(`Phonebook has info for ${count} people <br/><br/> ${recieved}`)
        })   

})

app.post("/api/persons", (request, response, next) => {
    const body = request.body
    
    const person = new Person({
        name: body.name, 
        number: body.number,
    })

    person.save()
     .then(savedPerson => {
        response.json(savedPerson)
     })
     .catch(error => next(error)
})

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
    const { name, number } = request.body

    Person.findByIdAndUpdate(
        request.params.id, 
        { name, number },
        { new: true, runValidators: true, context:'query' }
    )
    .then(result => {
        response.json(result)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
  }
  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
