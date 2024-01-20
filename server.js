const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;
const MONGODB_URI = process.env.REACT_APP_DB_URL ||'mongodb+srv://user:user123@user.acyk9eo.mongodb.net/?retryWrites=true&w=majority';

app.use(cors());
app.use(express.json());

mongoose.connect(MONGODB_URI,
 { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
  console.log("Database connected..!!");
})

const todoSchema = new mongoose.Schema({
  title: String,
});

const Todo = mongoose.model('Task', todoSchema);

// Routes
app.post('/api/todos', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const todo = new Todo({ title });
    const result = await todo.save();
    return res.status(201).json(result);
  } catch (err) {
    console.error('Error creating todo:', err);
    return res.status(500).send('Internal Server Error');
  }
});
// 
app.get('/api/task', async (req,res)=>{
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    console.error('Error featching task:', error);
    res.status(500).send('Internal Server Error');
  }
})
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Todo.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      res.status(404).send('Todo not found');
    } else {
      res.status(204).send('Task Deleted Successfully');
    }
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).send('Internal Server Error');
  }
});

// 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
