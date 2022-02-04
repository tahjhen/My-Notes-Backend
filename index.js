import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Basic Configuration **********************************
const app = express();
dotenv.config();

//Middlewares
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

//MongoDb Atlas Connection
// const CONNECTION_URL =
//   "mongodb+srv://tahjh:tahjh123@cluster0.z7msn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((err) => console.log(err.message));

//mongoose.set("useFindAndModify", false);

// Mongoose Schema and Model ********************************************************

const { Schema } = mongoose;

const toDoSchema = new Schema({
  title: String, // String is shorthand for {type: String}
  details: String,
  category: String,
});

const PostToDo = mongoose.model("ToDo", toDoSchema);

// API - to post and get data from
//**********************************************
//Routes
app.get("/", (req, res) => {
  res.send("MY NOTES API");
});

// Handle Posts ******************************

app.post("/todos", async (req, res) => {
  //console.log(req.body);
  const todo = new PostToDo({
    title: req.body.title,
    details: req.body.details,
    category: req.body.category,
  });
  try {
    const savedTodo = await todo.save();
    res.json(savedTodo);
  } catch (error) {
    res.json({ message: error });
  }
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await PostToDo.find();
    res.json(todos);
  } catch (error) {
    res.json({ message: error });
  }
});

app.get("/todos/:toDoId", async (req, res) => {
  try {
    const todoId = await PostToDo.findById(req.params.toDoId);
    res.json(todoId);
  } catch (error) {
    res.json({ message: error });
  }
});

app.delete("/todos/:toDoId", async (req, res) => {
  try {
    const removedToDo = await PostToDo.deleteOne({ _id: req.params.toDoId });
  } catch (error) {
    res.json({ message: error });
  }
});
