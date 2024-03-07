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
  Person.findById(request.params.id)
    .then((person) => response.json(person))
    .catch((error) => next(error));
});

app.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    const html = `
        <p>Phonebook has info about ${persons.length} people</p>
        <p>${new Date().toUTCString()}</p>
    `;
    response.send(html);
  });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((person) => response.json(person));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => response.json(updatedPerson))
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.log(error);

  if (error.name === "CasrError") {
    return response.status(400).send({ error: "Wrong format id" });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
