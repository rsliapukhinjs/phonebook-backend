const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
app.use(express.json());

app.use(express.static("dist"));

const cors = require("cors");
app.use(cors());

const morgan = require("morgan");
morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const Person = require("./models/person");

app.get("/", (request, response) => {
  response.send("<h1>Phonebook App</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => response.json(persons));
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

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((person) => response.json(person));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
