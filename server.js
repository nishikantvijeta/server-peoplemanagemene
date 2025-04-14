// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://mydatabase/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Person Model
const Person = mongoose.model('Person', new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  mobileNo: String
}));

// Routes
app.get('/person', async (req, res) => {
  try {
    const people = await Person.find();
    res.json(people);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching people' });
  }
});

app.post('/person', async (req, res) => {
  const { name, age, gender, mobileNo } = req.body;
  const newPerson = new Person({ name, age, gender, mobileNo });
  
  try {
    await newPerson.save();
    res.status(201).json(newPerson);
  } catch (err) {
    res.status(400).json({ message: 'Error saving person' });
  }
});

app.put('/person/:id', async (req, res) => {
  const { id } = req.params;
  const { name, age, gender, mobileNo } = req.body;

  try {
    const updatedPerson = await Person.findByIdAndUpdate(id, { name, age, gender, mobileNo }, { new: true });
    res.json(updatedPerson);
  } catch (err) {
    res.status(400).json({ message: 'Error updating person' });
  }
});

app.delete('/person/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Person.findByIdAndDelete(id);
    res.status(200).json({ message: 'Person deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting person' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
