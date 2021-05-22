const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const format = require("date-fns");

const path = require("path");

const dbPath = path.join(__dirname, "todoApplication.db");
let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server starting at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`Error message${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//status query
app.get("/todos/", async (request, response) => {
  const {
    status = "",
    priority = "",
    search_q = "",
    category = "",
  } = request.query;
  const getTodosQuery = `SELECT * FROM todo
   WHERE priority LIKE '${priority}';`;
  const getTodosQuery = `SELECT * FROM todo
   WHERE  status LIKE '${status}';`;
  const getTodosQuery = `SELECT * FROM todo
   WHERE priority LIKE '${priority}' AND status LIKE '${status}';`;
  const getTodosQuery = `SELECT * FROM todo
   WHERE todo LIKE '%${search_q}%'`;
  const getTodosQuery = `SELECT * FROM todo
   WHERE category LIKE '${category}' AND status LIKE '${status}';`;
  const getTodosQuery = `SELECT * FROM todo
   WHERE category LIKE '${category}';`;
  const getTodosQuery = `SELECT * FROM todo
   WHERE priority LIKE '${priority}' AND category LIKE '${category}';`;
  const todosList = await db.all(getTodosQuery);
  if (todosList.length === 0 || todosList === undefined) {
    response.status(400);
    response.send("Invalid Todo Category");
  } else {
    response.send(todosList);
  }
});

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoQuery = `SELECT * FROM todo
   WHERE id = '${todoId}';`;
  const todosList = await db.get(getTodoQuery);
  if (todosList === undefined) {
    response.status(400);
    response.send("Invalid Todo Category");
  } else {
    response.send(todosList);
  }
});

app.get("/agenda/", async (request, response) => {
  const { dueDate } = request.params;
  const getTodosQuery = `SELECT * FROM todo
   WHERE due_Date= '${dueDate}';`;
  const todosList = await db.all(getTodosQuery);
  if (todosList.length === 0 || todosList === undefined) {
    response.status(400);
    response.send("Invalid Due Date");
  } else {
    response.send(todosList);
  }
});

app.post("/todos/", async (request, response) => {
  const todoDetails = request.body;
  const { id, todo, priority, status, category, due_Date } = todoDetails;
  const getTodosQuery = `INSERT INTO todo(todo,priority,status,category,due_Date)
  VALUES (todo='${todo}',priority='${priority}',status='${status}',category='${category}',due_Date=${dueDate} WHERE id='${id}');`;
  await db.run(getTodosQuery);
  response.send("Todo Successfully Added");
});

app.put("/todos/:todoId/", async (request, response) => {
  const {
    status = "",
    priority = "",
    todo = "",
    category = "",
    dueDate,
  } = request.body;
  const { todoId } = request.params;
  const getTodosQuery = `UPDATE todo SET due_Date='${dueDate}',category='${category}',status='${status}',priority='${priority}',todo='${todo}' WHERE id='${todoId}';`;
  await db.run(getTodosQuery);
  response.send("Category Updated");
});

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodosQuery = `DELETE FROM todo  WHERE id='${todoId}';`;
  await db.run(getTodosQuery);
  response.send("Todo Deleted");
});

module.exports.app = app;
