const mongoose = require("mongoose");

const password = process.argv[2];

const url = `mongodb+srv://rsliapukhinjs:${password}@cluster0.bs3lgww.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const newName = process.argv[3];
const newNumber = process.argv[4];

const person = new Person({
  name: newName,
  number: newNumber,
});

if (process.argv.length === 3) {
  console.log("Phonebook: ");
  Person.find({}).then((persons) => {
    persons.forEach((p) => console.log(p));
    mongoose.connection.close();
  });
}

if (process.argv.length === 5) {
  person.save().then((result) => {
    console.log(`Added ${newName} number ${newNumber} to phonebook!`);
    mongoose.connection.close();
  });
} else {
  console.log("Please, provide new name and new number for the contact");
}
