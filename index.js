const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', function (req) { return JSON.stringify(req.body) })

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const generateId = () => {
    newid = Math.floor(Math.random() * 1000)
    return newid.toString()
}

app.get("/", (request, response) => {
    response.send("Hello World!")
})

app.get("/api/persons", (request, response) => {
    Person.find({}).then (people => {
        response.json(people)
    })
})

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
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

    if (persons.filter(person => person.name === body.name).length > 0) {
        return response.status(400).json({
            error: 'name must be unique'
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

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})