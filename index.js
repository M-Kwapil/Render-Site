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
    let people = persons.length

    response.send(`Phonebook has info for ${people} people <br/><br/> ${recieved}`)

})

app.post("/api/persons", (request, response) => {
    const body = request.body

    if (!body.name | !body.number){
        return response.status(400).json({
            error: 'content missing'
        })
    }
    const person = new Person({
        name: body.name, 
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
