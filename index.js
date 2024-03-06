const express = require("express");
const app = express();
app.use(express.json());

const morgan = require("morgan");
morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Phonebook App</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = +request.params.id;
  const person = persons.find((p) => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.get("/info", (request, response) => {
  const html = `
        <p>Phonebook has info about ${persons.length} people</p>
        <p>${new Date().toUTCString()}</p>
    `;

  response.send(html);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = +request.params.id;
  console.log(id);
  persons = persons.filter((person) => person.id !== id);
  console.log(persons);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  const duplicates = persons.filter((p) => p.name === body.name);
  console.log(persons, body.name);

  if (!body.name) {
    return response.status(400).json({
      error: "The name is missing",
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: "The number is missing",
    });
  } else if (duplicates.length > 0) {
    return response.status(400).json({
      error: "The name must be unique",
    });
  }

  const newPerson = {
    id: Math.random().toFixed(3) * 1000,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);
  response.json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
