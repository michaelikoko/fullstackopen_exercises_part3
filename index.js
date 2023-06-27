const express = require("express")
const app = express()

//cors
const cors = require("cors")
app.use(cors())

//json parser middleware
app.use(express.json())

//morgan middleware
const morgan = require("morgan")
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let entries = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get("/info", (request, response) => {
    const date = new Date()
    response.send(`<div>Phonebook has info for ${entries.length} people</div><br/><div>${date}</div>`)
})

app.get("/api/persons", (request, response) => {
    response.json(entries)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const entry = entries.find(entry => entry.id === id)

    if (entry) {
        return response.json(entry)
    }
    else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    entries = entries.filter(entry => entry.id !== id)

    response.status(204).end()
})

const generateId = () => {
    let randomId
    do {
        randomId = Math.floor(Math.random() * 10000000)
        console.log(randomId)
    } while (entries.some(entry=>entry.id === randomId))
    return randomId
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }
    if (entries.some(entry => body.name === entry.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const entry = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    entries = entries.concat(entry)

    response.json(entry)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})